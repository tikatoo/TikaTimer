<template>
    <div class="offset-entry">
        <input class="offset-value" type="number" step="0.001"
            v-model="offsetValue"
            v-on:change="valueChanged($event.target.value,
                                      $event.target.checkValidity())"
            />
    </div>
</template>

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
            if (newValue === "") {
                this.$emit('delete')
            } else if (valid) {
                this.$emit('change', Number.parseFloat(newValue))
            }
        }
    }
})
</script>


<style scoped>
    .offset-entry {
        font-size: 1.5em;
        margin-bottom: 5px;
    }
    .offset-entry * { font-size: 1em; }
    .offset-entry:last-child {
        margin-bottom: 0;
    }

    .offset-entry input.offset-value {
        background: #fbfbfb;
        border: 1px solid #888;
        border-radius: 5px;
        display: block;
        width: calc(100% - 4px);
        -webkit-appearance: textfield;
        -moz-appearance: textfield;
    }
</style>
