<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold mb-6">List Film Star Wars</h1>
    <span v-if="loading" class="loading loading-spinner loading-lg text-info"></span>
    <div v-else-if="error" class="text-red-500">Terjadi kesalahan: {{ error.message }}</div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="film in films" :key="film.id" class="card bg-base-100 shadow-xl">
          <figure class="px-10 pt-10">
            <img :src="film.imageURL" alt="Film Poster" class="rounded-xl" />
          </figure>
          <div class="card-body items-center text-center">
            <h3 class="card-title">{{ film.title }}</h3>
            <p><strong>Director:</strong> {{ film.director }}</p>
            <p><strong>Release Date:</strong> {{ film.releaseDate }}</p>
            <div class="card-actions">
              <button @click="gotoFilmDetail(film.id)" class="btn btn-primary">Detail</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { gql } from '@apollo/client/core';
import { useQuery } from '@vue/apollo-composable';
import fetchFilmImage from '../utils/fetchFilmImage.ts';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CharacterFilm',
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

    const gotoFilmDetail = (filmId: string) => {
      router.push({ path: `/film/${filmId}` });
    };

    return {
      films,
      loading: isLoading,
      error,
      gotoFilmDetail,
    };
  },
});
</script>
