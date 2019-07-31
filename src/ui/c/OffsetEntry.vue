<template>
    <div class="offset-entry">
        <input class="offset-value" type="number" step="any"
            v-model="offsetValue"
            v-on:change="valueChanged($event.target.value,
                                      $event.target.checkValidity())"
            />

        <span class="i-trash">D</span>
    </div>
</template>

<style scoped>
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: ['offsetValue'],
    model: {
        prop: 'offsetValue',
        event: 'change'
    },
    methods: {
        valueChanged(newValue: string, valid: boolean) {
            if (valid) {
                this.$emit('change', Number.parseFloat(newValue))
            }
        }
    }
})
</script>
