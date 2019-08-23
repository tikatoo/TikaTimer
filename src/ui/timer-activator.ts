
export type AudioSourceUpdater = (newAudioSource: AudioScheduledSourceNode) => void

export function initTimerController(
    el: HTMLElement, ctx: AudioContext,
    onStart: () => void, onStop: () => void, onReset: () => void
): AudioSourceUpdater {
    let audioSource: AudioScheduledSourceNode

    type SomeEvent = KeyboardEvent | MouseEvent | TouchEvent
    type AnyHandler = (event: SomeEvent) => void
    type EventHandlers = {
        keyboard: (event: KeyboardEvent) => void,
        mouse: (event: MouseEvent) => void,
        touch: (event: TouchEvent) => void,
    }
    let changeHandlers = (toRemove: EventHandlers | null, toAdd: EventHandlers) => {
        if (toRemove != null) {
            document.removeEventListener('keydown', toRemove.keyboard)
            el.removeEventListener('mousedown', toRemove.mouse)
            el.removeEventListener('touchstart', toRemove.touch)
        }
        document.addEventListener('keydown', toAdd.keyboard)
        el.addEventListener('mousedown', toAdd.mouse)
        el.addEventListener('touchstart', toAdd.touch)
    }

    let makeHandler = (handler: AnyHandler) => ({
        mouse: handler, touch: handler,
        keyboard(event: KeyboardEvent) {
            if (event.key == ' ') { handler(event) }
        },
    })

    let onActivateStart = makeHandler((event: SomeEvent) => {
        audioSource.start(0)
        event.preventDefault()
        changeHandlers(onActivateStart, onActivateStop)
        onStart()
    })

    let onActivateStop = makeHandler((event: SomeEvent) => {
        audioSource.stop(0)
        event.preventDefault()
        onAfterStop()
    })

    let onAfterStop = () => {
        changeHandlers(onActivateStop, onActivateReset)
        onStop()
    }

    let onActivateReset = makeHandler((event: SomeEvent) => {
        event.preventDefault()
        doReset()
    })

    let doReset = () => {
        changeHandlers(onActivateReset, onActivateStart)
        onReset()
    }

    return (newAudioSource) => {
        changeHandlers(null, onActivateStart)
        newAudioSource.addEventListener('ended', onAfterStop)
        newAudioSource.connect(ctx.destination)
        audioSource = newAudioSource
    }
}
