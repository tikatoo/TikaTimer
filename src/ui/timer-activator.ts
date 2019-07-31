
export type AudioSourceUpdater = (newAudioSource: AudioScheduledSourceNode) => void

export function initTimerController(
    el: HTMLElement, ctx: AudioContext,
    onStart: () => void, onStop: () => void, onReset: () => void
): AudioSourceUpdater {
    let audioSource: AudioScheduledSourceNode | null = null

    let eventKind: ('mousedown' | 'touchstart') =
        (<any>window).TouchEvent == null ? 'mousedown' : 'touchstart'
    type EventHandler = (event: MouseEvent | TouchEvent) => void
    let changeHandlers = (toRemove: EventHandler | null, toAdd: EventHandler) => {
        el.removeEventListener(eventKind, toRemove as EventHandler)
        el.addEventListener(eventKind, toAdd)
    }

    let onActivateStart = (event: MouseEvent | TouchEvent) => {
        // TODO: Start audio
        event.preventDefault()
        changeHandlers(onActivateStart, onActivateStop)
        onStart()
    }

    let onActivateStop = (event: MouseEvent | TouchEvent) => {
        // TODO: Stop audio
        event.preventDefault()
        changeHandlers(onActivateStop, onActivateReset)
        onStop()
    }

    let onActivateReset = (event: MouseEvent | TouchEvent) => {
        event.preventDefault()
        changeHandlers(onActivateReset, onActivateStart)
        onReset()
    }

    changeHandlers(null, onActivateStart)

    return (newAudioSource) => {
        newAudioSource.connect(ctx.destination)
        audioSource = newAudioSource
    }
}
