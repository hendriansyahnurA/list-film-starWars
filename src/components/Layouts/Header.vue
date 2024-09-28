<template>
  <div class="relative w-full h-72">
    <!-- Overlay hitam dengan transparansi untuk teks dan tombol -->
    <img src="../../assets/image/starWars.jpg" alt="Star Wars Banner" class="w-full h-full object-cover rounded-xl" />
    <div
      class="rounded-xl absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white"
    >
      <h2 class="text-4xl font-bold mb-4">Welcome to <strong class="text-yellow-400">Star Wars</strong> Films</h2>
      <p class="text-lg mb-4">Explore the adventures in a galaxy far, far away</p>
      <router-link to="/character" class="btn btn-warning hover:no-underline">Character</router-link>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Header',
};
</script>

<style scoped>
/* Jika perlu, tambahkan custom styling */
</style>
