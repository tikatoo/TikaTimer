<template>
    <div class="timer-control page-width">
        <h2 class="timer-display">{{ timerValue }}</h2>
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

export default Vue.extend({
    props: ['offsets'],
    data() {
        return {
            timerValue: getTimerValue(this.offsets)
        }
    },
    watch: {
        offsets(newValue: IValueContainer[], oldValue: IValueContainer[]) {
            this.timerValue = getTimerValue(newValue)
        }
    },
    methods: {
        start() {
            // TODO: Start a countdown thingy
        }
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

