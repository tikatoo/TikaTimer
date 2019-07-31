<template>
    <div class="configure page-width">
        <offset-entry
            v-for="(offset, index) in offsets"
            v-bind:key="index"
            v-model="offset.value"
            v-on:change="onChange()"
            />
        <offset-entry v-on:change="onAdd($event)" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import OffsetEntry from './OffsetEntry.vue'

interface IValueContainer {
    value: number
}

export default Vue.extend({
    components: { OffsetEntry },
    data() {
        return {
            offsets: (<IValueContainer[]> [])
        }
    },
    methods: {
        onChange() {
            this.offsets.sort((a, b) => a.value - b.value)
            this.$emit('change')
        },
        onAdd(value: number) {
            for (let [index, o] of this.offsets.entries()) {
                if (o.value > value) {
                    this.offsets.splice(index, 0, { value })
                    break
                }
            }
        }
    },
})
</script>
