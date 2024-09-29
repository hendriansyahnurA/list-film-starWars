<template>
  <button :class="['btn', buttonType]" :type="type" @click="handleClick">
    {{ label }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Button',
  props: {
    label: {
      type: String,
      default: 'Button',
    },
    type: {
      type: String as () => 'button' | 'submit' | 'reset',
      default: 'button',
    },
    buttonType: {
      type: String,
      default: 'btn-warning',
    },
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
});
</script>
