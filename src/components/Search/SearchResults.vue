<template>
  <div class="p-5">
    <h1 class="text-3xl font-bold underline underline-offset-8">Hasil Pencarian: "{{ searchQuery }}"</h1>
    <span v-if="loading" class="loading loading-spinner loading-lg text-info"></span>
    <div v-else-if="error" class="text-red-500">Terjadi kesalahan: {{ error.message }}</div>
    <div v-else-if="results.length > 0">
      <ul class="list-none p-0">
        <li v-for="item in results" :key="item.id">
          <p>{{ item.name || item.title }}</p>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Tidak ada hasil ditemukan.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchResults',
  data() {
    return {
      results: [],
      loading: false,
      error: null,
    };
  },
  computed: {
    searchQuery() {
      return this.$route.query.q || ''; // Mengambil query pencarian dari URL
    },
  },
  watch: {
    searchQuery: 'fetchResults', // Memanggil fetchResults saat searchQuery berubah
  },
  methods: {
    async fetchResults() {
      if (!this.searchQuery) {
        this.results = [];
        return;
      }
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`YOUR_API_ENDPOINT?search=${encodeURIComponent(this.searchQuery)}`);

        // Cek apakah respons OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Cek apakah respons adalah JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          this.results = data.results; // Sesuaikan dengan struktur data dari API Anda
        } else {
          // Jika tidak dalam format JSON, ambil sebagai teks
          const text = await response.text();
          console.error('Expected JSON, got:', text);
          this.error = new Error('Unexpected response format');
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },

  mounted() {
    this.fetchResults(); // Memanggil fetchResults saat komponen di-mount
  },
};
</script>
