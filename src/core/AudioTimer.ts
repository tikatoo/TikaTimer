

interface IAudioSignal {
    triggerAt: number,
    pulsePoint: number,
    audio: AudioBuffer,
}

export default class AudioTimer {
    private sampleRate: number
    private signals: IAudioSignal[]
    private length: number

    constructor(sampleRate: number) {
        this.sampleRate = sampleRate
        this.signals = []
        this.length = 0
    }

    addSignal(
        triggerAt: number,
        pulsePoint: number = 0,
        audio: AudioBuffer
    ): void {
        if (audio.sampleRate !== this.sampleRate) {
            throw "Sample rate doesn't match"
        }

        // triggerAt is in milliseconds; convert to samples
        triggerAt = Math.round(triggerAt * (this.sampleRate / 1000))

        let into = -1
        for (let [i, s] of this.signals.entries()) {
            if (triggerAt < s.triggerAt) {
                into = i
                break
            }
        }

        if (into < 0) {
            into = this.signals.length
            this.length = triggerAt + (audio.length - pulsePoint)
        }

        this.signals.splice(into, 0, { triggerAt, pulsePoint, audio })
    }

    removeSignal(triggeredAt: number): void {
        let index = -1
        for (let [i, s] of this.signals.entries()) {
            if (triggeredAt === s.triggerAt) {
                index = i
            }
        }

        if (index > 0) {
            this.signals.splice(index, 1)
        }

        if (index === this.signals.length) {
            let last = this.signals[index - 1]
            this.length = last.triggerAt + (last.audio.length - last.pulsePoint)
        }
    }

    generateArray(): Float32Array {
        let arr = new Float32Array(this.length)

        for (let signal of this.signals) {
            let sample = signal.triggerAt - signal.pulsePoint
            let sourceSamples = signal.audio.getChannelData(0)
            arr.set(sourceSamples, sample)
        }

        return arr
    }

    generateBuffer(context: AudioContext): AudioBuffer {
        let ab = context.createBuffer(1, this.length, this.sampleRate)
        ab.copyToChannel(this.generateArray(), 0)
        return ab
    }
}
