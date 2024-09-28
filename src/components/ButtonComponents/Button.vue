<template>
  <button :class="['btn', buttonType]" :type="type" @click="handleClick">
    {{ label }}
  </button>
</template>

<script lang="ts">
export default {
  name: 'Button',
  props: {
    label: {
      type: String,
      default: 'Button',
    },
    type: {
      type: String,
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
};
</script>
