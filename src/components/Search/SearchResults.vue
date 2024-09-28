<template>
  <div class="p-5">
    <h1 class="text-3xl font-bold underline underline-offset-8 mb-4">Hasil Pencarian: "{{ searchQuery }}"</h1>

    <!-- Loading Spinner -->
    <span v-if="loading" class="loading loading-spinner loading-lg text-info"></span>

    <!-- Error Message -->
    <div v-else-if="error" class="text-red-500">Terjadi kesalahan: {{ error.message }}</div>

    <!-- Results -->
    <div v-else-if="results.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="item in results" :key="item.id" class="card bg-base-100 shadow-xl">
        <figure>
          <img :src="item.imageURL || 'https://via.placeholder.com/150'" alt="Image" class="w-full h-48 object-cover" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ item.name || item.title }}</h2>
          <p>{{ item.gender || item.director }}</p>
          <p>{{ item.birth_year || item.release_date }}</p>
          <p>{{ item.homeworld || item.producer || 'No description available' }}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Detail</button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
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
        const endpoints = ['people', 'films'];

        const requests = endpoints.map((endpoint) =>
          fetch(`https://swapi.dev/api/${endpoint}/?search=${encodeURIComponent(this.searchQuery)}`).then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status} on ${endpoint}`);
            }
            return res.json();
          })
        );

        const resultsArray = await Promise.all(requests);

        this.results = resultsArray.flatMap((result) => result.results);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchResults();
  },
};
</script>
