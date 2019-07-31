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

export default Vue.extend({
    props: ['timerLength'],
    data() {
        return {
            timerValue: this.timerLength
        }
    },
    watch: {
        timerLength(newValue: number, oldValue: number) {
            this.timerValue = newValue
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

