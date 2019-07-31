<template>
    <div class="app">
        <timer-control :timerLength="timerLength" />
        <offset-configure ref="configuration" v-on:change="updateOffsets()" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TimerControl from './TimerControl.vue'
import OffsetConfigure from './OffsetConfigure.vue'

export default Vue.extend({
    components: { TimerControl, OffsetConfigure },
    data() {
        return {
            timerLength: 0
        }
    },
    methods: {
        updateOffsets() {
            let offsets = (<Vue>this.$refs.configuration).$data.offsets
            
            if (offsets.length === 0) {
                this.timerLength = 0
            } else {
                this.timerLength = offsets[offsets.length - 1].value
            }
        }
    },
})
</script>

<style scoped>
    .page-width {
        background: #eee;
        border-radius: 10px;
        padding: 10px;
        margin: 0 auto 10px;
        max-width: 500px;
    }
</style>

