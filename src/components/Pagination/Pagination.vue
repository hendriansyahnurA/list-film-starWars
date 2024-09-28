<template>
  <div class="btn-group mt-4 flex items-center justify-center">
    <button class="btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">«</button>
    <button
      v-for="page in totalPages"
      :key="page"
      :class="['btn', { 'btn-active': page === currentPage }]"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>
    <button class="btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">»</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: ['page-change'],
  methods: {
    goToPage(page: number) {
      this.$emit('page-change', page);
    },
  },
});
</script>
