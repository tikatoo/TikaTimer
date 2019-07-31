<template>
    <div class="app">
        <timer-control :offsets="offsets" />
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
            offsets: []
        }
    },
    methods: {
        updateOffsets() {
            this.offsets = (<Vue>this.$refs.configuration).$data.offsets
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

