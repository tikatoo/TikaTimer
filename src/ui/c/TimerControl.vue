<template>
    <div class="timer-control page-width">
        <h2 class="timer-display" ref="controller">{{ timerValue.toFixed(3) }}</h2>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface IValueContainer {
    value: number
}

function getTimerValue(offsets: IValueContainer[]): number {
    if (offsets == null || offsets.length === 0) {
        return 0
    } else {
        return offsets[offsets.length - 1].value
    }
}

type AudioSourceUpdater = (newAudioSource: AudioScheduledSourceNode) => void
function initTimerController(
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

interface ComponentPrivateAttrs {
    privStarted: boolean | null
    privAnimFrame: number | null
    privContext: AudioContext
    privUpdateSource: AudioSourceUpdater
}

function priv(component: Vue): ComponentPrivateAttrs {
    return <ComponentPrivateAttrs><unknown>component
}

export default Vue.extend({
    props: ['offsets'],
    mounted() {
        let ctx = new AudioContext()
        priv(this).privContext = ctx
        priv(this).privUpdateSource = initTimerController(
            this.$refs.controller as HTMLHeadingElement, ctx,
            this.start.bind(this), this.stop.bind(this), this.reset.bind(this)
        )
    },
    data() {
        return {
            timerStart: getTimerValue(this.offsets),
            timerProgress: 0
        }
    },
    watch: {
        offsets(newValue: IValueContainer[], oldValue: IValueContainer[]) {
            this.timerStart = getTimerValue(newValue)
        }
    },
    computed: {
        timerValue(): number {
            return this.timerStart - this.timerProgress
        },
    },
    methods: {
        start() {
            // Animate the countdown timer.
            let last = 0
            let dt = 0

            let onFrame = (now: DOMHighResTimeStamp) => {
                if (last !== 0)
                    dt = now - last
                last = now
                this.timerProgress += (dt / 1000)

                if (this.timerProgress >= this.timerStart) {
                    this.timerProgress = this.timerStart
                    priv(this).privAnimFrame = null
                } else {
                    priv(this).privAnimFrame = requestAnimationFrame(onFrame)
                }
            }

            requestAnimationFrame(onFrame)
        },

        stop() {
            let animFrame = priv(this).privAnimFrame
            if (animFrame != null) {
                cancelAnimationFrame(animFrame)
                priv(this).privAnimFrame = null
            }
        },

        reset() {
            this.timerProgress = 0
        },
    },
})
</script>

<style scoped>
    h2.timer-display {
        margin: 0;
        text-align: center;
        font-size: 5em;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>

