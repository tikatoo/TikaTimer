import AudioTimer from '../core/AudioTimer'


let ctx = new AudioContext()
let timerAudio: AudioBuffer

fetch('click.wav')
    .then((res) => res.arrayBuffer())
    .then((buf) => ctx.decodeAudioData(buf))
    .then((data) => {
        let repeater = new AudioTimer(data.sampleRate)
        repeater.addSignal(0, 220, data)
        repeater.addSignal(500, 220, data)
        repeater.addSignal(1000, 220, data)
        repeater.addSignal(1500, 220, data)
        repeater.addSignal(2000, 220, data)
        let rep = repeater.generateBuffer(ctx)

        let timer = new AudioTimer(rep.sampleRate)
        let smPerMs = rep.sampleRate / 1000
        let toSamples = (ms: number) => Math.round(ms * smPerMs)
        timer.addSignal(10132, toSamples(2000), rep)
        timer.addSignal(17074, toSamples(2000), rep)
        timer.addSignal(23189, toSamples(2000), rep)
        timer.addSignal(36272, toSamples(2000), rep)
        timer.addSignal(63373, toSamples(2000), rep)
        timerAudio = timer.generateBuffer(ctx)
    })
    .then(() => {
        let btn = document.getElementById('start-btn') as HTMLButtonElement
        let taSource = ctx.createBufferSource()
        taSource.buffer = timerAudio
        taSource.connect(ctx.destination)
        taSource.addEventListener('ended', (e) => {
            taSource = ctx.createBufferSource()
            taSource.buffer = timerAudio
            taSource.connect(ctx.destination)
            btn.disabled = false
        })
        btn.addEventListener('click', (e) => {
            btn.disabled = true
            taSource.start(0)
        })
        btn.disabled = false
    })
