<template>
    <div class="app">
        <timer-control :offsets="offsets" @ready="loadOffsets()" />
        <offset-configure ref="configuration" @change="updateOffsets()" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TimerControl from './TimerControl.vue'
import OffsetConfigure from './OffsetConfigure.vue'

interface IValueContainer {
    value: number
}

function decodeOffsets(src: string): IValueContainer[] {
    return src.split('/').map(v => ({ value: Number.parseFloat(v) }))
}

function encodeOffsets(offsets: IValueContainer[]): string {
    return offsets.map(o => o.value.toFixed(3)).join('/')
}

export default Vue.extend({
    components: { TimerControl, OffsetConfigure },

    data() {
        return {
            offsets: (<IValueContainer[]> [])
        }
    },

    methods: {
        updateOffsets() {
            this.offsets = (<Vue>this.$refs.configuration).$data.offsets
            localStorage.setItem('_default', encodeOffsets(this.offsets))
        },
        loadOffsets() {
            let stored = localStorage.getItem('_default')
            if (stored != null && stored !== "") {
                this.offsets = decodeOffsets(stored)
                ;(<Vue>this.$refs.configuration).$data.offsets = this.offsets
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

