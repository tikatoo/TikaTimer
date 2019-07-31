
export type AudioSourceUpdater = (newAudioSource: AudioScheduledSourceNode) => void

export function initTimerController(
    el: HTMLElement, ctx: AudioContext,
    onStart: () => void, onStop: () => void, onReset: () => void
): AudioSourceUpdater {
    let audioSource: AudioScheduledSourceNode

    type EventHandler = (event: MouseEvent | TouchEvent) => void
    let changeHandlers = (toRemove: EventHandler | null, toAdd: EventHandler) => {
        el.removeEventListener('mousedown', toRemove as EventHandler)
        el.removeEventListener('touchstart', toRemove as EventHandler)
        el.addEventListener('mousedown', toAdd)
        el.addEventListener('touchstart', toAdd)
    }

    let started = false
    let stopped = false
    let reseted = false

    let onActivateStart = (event: MouseEvent | TouchEvent) => {
        if (started) { return }
        audioSource.start(0)
        event.preventDefault()
        started = true
        stopped = false
        reseted = false
        changeHandlers(onActivateStart, onActivateStop)
        onStart()
    }

    let onActivateStop = (event: MouseEvent | TouchEvent) => {
        if (stopped) { return }
        audioSource.stop(0)
        event.preventDefault()
        started = false
        stopped = true
        reseted = false
        onAfterStop()
    }

    let onAfterStop = () => {
        changeHandlers(onActivateStop, onActivateReset)
        onStop()
    }

    let onActivateReset = (event: MouseEvent | TouchEvent) => {
        if (reseted) { return }
        event.preventDefault()
        started = false
        stopped = false
        reseted = true
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
