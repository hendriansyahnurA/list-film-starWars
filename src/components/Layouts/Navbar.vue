<template>
  <div id="app" class="p-3">
    <div class="navbar bg-black bg-opacity-80 rounded-xl shadow-xl mb-4">
      <div class="flex-1">
        <router-link to="/" class="text-xl text-yellow-400 font-bold">Star Wars</router-link>
      </div>
      <div class="flex-none gap-2">
        <div class="form-control">
          <input type="text" placeholder="Search..." class="input input-bordered md:w-auto" v-model="searchQuery" />
        </div>
        <div>
          <button class="btn btn-warning w-full md:w-auto sm:w-20" @click="searchData">Search</button>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'Navbar',
  data() {
    return {
      searchQuery: '',
    };
  },
  methods: {
    searchData() {
      this.$router.push({ name: 'SearchResults', query: { q: this.searchQuery } });
    },
  },
};
</script>
