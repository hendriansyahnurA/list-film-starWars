<template>
  <div class="w-full">
    <Header />
  </div>
  <h1 class="text-3xl font-bold p-5 underline underline-offset-8">List Film Star Wars</h1>
  <div class="items-center justify-center py-2">
    <span v-if="loading" class="loading loading-spinner loading-lg text-warning"></span>
    <div v-else-if="error" class="text-red-500">Terjadi kesalahan: {{ error.message }}</div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="film in paginatedFilm" :key="film.id" class="card bg-gray-900 card-compact shadow-xl min-w-[250px]">
          <figure>
            <img :src="film.imageURL" alt="Film Poster" class="w-full h-48 object-cover" />
          </figure>
          <div class="card-body h-auto">
            <h3 class="card-title">{{ film.title }}</h3>
            <p><strong>Director:</strong> {{ film.director }}</p>
            <p><strong>Release Date:</strong> {{ film.releaseDate }}</p>
            <div class="card-actions">
              <Button label="Detail" @click="gotoFilmDetail(film.id)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="handlePageChange" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { gql } from '@apollo/client/core';
import { useQuery } from '@vue/apollo-composable';
import fetchFilmImage from '../utils/fetchFilmImage.ts';
import { useRouter } from 'vue-router';
import Pagination from '../components/Pagination/Pagination.vue';
import Header from '../components/Layouts/Header.vue';
import Button from '../components/ButtonComponents/Button.vue';
export default defineComponent({
  name: 'CharacterFilm',
  components: { Pagination, Header, Button },
  setup() {
    const router = useRouter();
    const GET_FILMS = gql`
      query GetFilms {
        allFilms {
          films {
            id
            title
            director
            releaseDate
          }
        }
      }
    `;

    const { result, loading, error } = useQuery(GET_FILMS);
    const films = ref<any[]>([]);
    const isLoading = ref(true);
    const filmPerPage = 4;
    const currentPage = ref(1);

    const totalPages = computed(() => Math.ceil(films.value.length / filmPerPage));
    const paginatedFilm = computed(() => {
      const start = (currentPage.value - 1) * filmPerPage;
      const end = start + filmPerPage;
      return films.value.slice(start, end);
    });
    onMounted(async () => {
      if (result.value && result.value.allFilms && result.value.allFilms.films) {
        films.value = await Promise.all(
          result.value.allFilms.films.map(async (film: any) => {
            const imageURL = await fetchFilmImage(film.title);
            return {
              ...film,
              imageURL,
            };
          })
        );

        setTimeout(() => {
          isLoading.value = false;
        }, 1000);
      }
    });

    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    const gotoFilmDetail = (filmId: string) => {
      router.push({ path: `/film/${filmId}` });
    };

    return {
      films,
      loading: isLoading,
      error,
      gotoFilmDetail,
      handlePageChange,
      totalPages,
      paginatedFilm,
      currentPage,
    };
  },
});
</script>
