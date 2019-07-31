<template>
    <div class="timer-control page-width">
        <h2 class="timer-display" v-if="activated" ref="controller">{{ timerValue.toFixed(3) }}</h2>
        <h2 class="timer-display" v-else @click="activated = true">Start</h2>
    </div>
</template>

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

<script lang="ts">
import Vue from 'vue'

import AudioTimer from '../../core/AudioTimer'
import { AudioSourceUpdater, initTimerController }
    from '../timer-activator'


interface IValueContainer {
    value: number
}

interface IComponentPrivateAttrs {
    privStarted: boolean | null
    privAnimFrame: number | null
    privContext: AudioContext
    privUpdateSource: AudioSourceUpdater
    privAudioBasePulse: number
    privAudioBase: AudioBuffer
    privAudioFull: AudioBuffer
}

function getTimerValue(offsets: IValueContainer[]): number {
    if (offsets == null || offsets.length === 0) {
        return 0
    } else {
        return offsets[offsets.length - 1].value
    }
}

function priv(component: Vue): IComponentPrivateAttrs {
    return <IComponentPrivateAttrs><unknown>component
}

export default Vue.extend({
    props: ['offsets'],

    async created() {
        let ctx = new AudioContext()
        priv(this).privContext = ctx

        let response = await fetch('click.wav')
        if (!response.ok) {
            throw response.statusText
        }

        let clickAudio = await ctx.decodeAudioData(await response.arrayBuffer())

        let repeater = new AudioTimer(clickAudio.sampleRate)
        repeater.addSignal(0, 0, clickAudio)
        repeater.addSignal(500, 0, clickAudio)
        repeater.addSignal(1000, 0, clickAudio)
        repeater.addSignal(1500, 0, clickAudio)
        repeater.addSignal(2000, 0, clickAudio)
        priv(this).privAudioBasePulse = 2.000 * clickAudio.sampleRate
        priv(this).privAudioBase = repeater.generateBuffer(ctx)

        this.$emit('ready')
    },

    updated() {
        if (this.activated && priv(this).privUpdateSource == null) {
            priv(this).privContext.resume()
            priv(this).privUpdateSource = initTimerController(
                this.$refs.controller as HTMLHeadingElement, priv(this).privContext,
                this.start.bind(this), this.stop.bind(this), this.reset.bind(this)
            )
            if (priv(this).privAudioFull != null) {
                this.setSource()
            }
        }
    },

    data() {
        return {
            activated: false,
            timerStart: getTimerValue(this.offsets),
            timerProgress: 0
        }
    },

    watch: {
        offsets(newValue: IValueContainer[], oldValue: IValueContainer[]) {
            this.timerStart = getTimerValue(newValue)

            let ctx = priv(this).privContext
            let pulsePoint = priv(this).privAudioBasePulse
            let pulseAudio = priv(this).privAudioBase

            let timer = new AudioTimer(pulseAudio.sampleRate)
            for (let { value } of newValue) {
                timer.addSignal(value * 1000, pulsePoint, pulseAudio)
            }
            let fullAudio = timer.generateBuffer(ctx)

            priv(this).privAudioFull = fullAudio
            if (priv(this).privUpdateSource != null) {
                this.setSource()
            }
        },
    },

    computed: {
        timerValue(): number {
            return this.timerStart - this.timerProgress
        },
    },

    methods: {
        setSource() {
            let source = priv(this).privContext.createBufferSource()
            source.buffer = priv(this).privAudioFull
            priv(this).privUpdateSource(source)
        },

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
            let ctx = priv(this).privContext
            let source = ctx.createBufferSource()
            source.buffer = priv(this).privAudioFull
            priv(this).privUpdateSource(source)
        },
    },
})
</script>

