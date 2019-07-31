
export type AudioSourceUpdater = (newAudioSource: AudioScheduledSourceNode) => void

export function initTimerController(
    el: HTMLElement, ctx: AudioContext,
    onStart: () => void, onStop: () => void, onReset: () => void
): AudioSourceUpdater {
    let audioSource: AudioScheduledSourceNode

    let eventKind: ('mousedown' | 'touchstart') =
        (<any>window).TouchEvent == null ? 'mousedown' : 'touchstart'
    type EventHandler = (event: MouseEvent | TouchEvent) => void
    let changeHandlers = (toRemove: EventHandler | null, toAdd: EventHandler) => {
        el.removeEventListener(eventKind, toRemove as EventHandler)
        el.addEventListener(eventKind, toAdd)
    }

    let onActivateStart = (event: MouseEvent | TouchEvent) => {
        audioSource.start(0)
        event.preventDefault()
        changeHandlers(onActivateStart, onActivateStop)
        onStart()
    }

    let onActivateStop = (event: MouseEvent | TouchEvent) => {
        audioSource.stop(0)
        event.preventDefault()
        onAfterStop()
    }

    let onAfterStop = () => {
        changeHandlers(onActivateStop, onActivateReset)
        onStop()
    }

    let onActivateReset = (event: MouseEvent | TouchEvent) => {
        event.preventDefault()
        doReset()
    }

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
