import AudioTimer from '../core/AudioTimer'
import OffsetConfigure from './c/OffsetConfigure.vue'


let ctx = new AudioContext()
let timerAudio: AudioBuffer

fetch('click.wav')
    .then((res) => res.arrayBuffer())
    .then((buf) => ctx.decodeAudioData(buf))
    .then((data) => {
        let repeater = new AudioTimer(data.sampleRate)
        repeater.addSignal(0, 0, data)
        repeater.addSignal(500, 0, data)
        repeater.addSignal(1000, 0, data)
        repeater.addSignal(1500, 0, data)
        repeater.addSignal(2000, 0, data)
        let rep = repeater.generateBuffer(ctx)

        let timer = new AudioTimer(rep.sampleRate)
        let smPerMs = rep.sampleRate / 1000
        let pulsePoint = Math.round(2000 * smPerMs)
        timer.addSignal(10132, pulsePoint, rep)
        timer.addSignal(17074, pulsePoint, rep)
        timer.addSignal(23189, pulsePoint, rep)
        timer.addSignal(36272, pulsePoint, rep)
        timer.addSignal(63373, pulsePoint, rep)
        timerAudio = timer.generateBuffer(ctx)
    })
    .then(() => {
        new OffsetConfigure({
            el: '#app',
            data: {
                offsets: [
                    { value: 10.132 },
                    { value: 17.074 },
                    { value: 23.189 },
                    { value: 36.272 },
                    { value: 63.373 },
                ]
            }
        })
    })
    .then(() => {
        let btn = document.getElementById('start-btn') as HTMLButtonElement
        let taSource: AudioBufferSourceNode

        let onStart = (e: MouseEvent | TouchEvent) => {
            taSource.start(0)
            e.preventDefault()
            btn.removeEventListener('touchstart', onStart)
            btn.removeEventListener('mousedown', onStart)
            btn.addEventListener('touchstart', onStop)
            btn.addEventListener('mousedown', onStop)
            btn.textContent = 'Stop'
        }

        let isClickEvent: (e: Event | null | undefined) => e is Event
        if (typeof (<any>window).TouchEvent == 'undefined') {
            isClickEvent = (e): e is Event =>
                e != null && e instanceof MouseEvent
        } else {
            isClickEvent = (e): e is Event =>
            e != null && (
                e instanceof MouseEvent || e instanceof TouchEvent
            )
        }

        let onStop = (e?: Event) => {
            if (isClickEvent(e)) {
                taSource.stop()
                e.preventDefault()
            }

            taSource = ctx.createBufferSource()
            taSource.buffer = timerAudio
            taSource.connect(ctx.destination)
            taSource.addEventListener('ended', onStop)

            btn.removeEventListener('touchstart', onStop)
            btn.removeEventListener('mousedown', onStop)
            btn.addEventListener('touchstart', onStart)
            btn.addEventListener('mousedown', onStart)
            btn.textContent = 'Start'
        }

        btn.addEventListener('touchstart', onStart)
        btn.addEventListener('mousedown', onStart)

        onStop()
        btn.disabled = false
    })
