<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold mb-6">Star Wars Film Details</h1>
    <span v-if="loading" class="loading loading-spinner loading-lg text-info"></span>
    <div v-else-if="error">Terjadi kesalahan: {{ error.message }}</div>
    <div v-else v-if="filmDetails">
      <div class="card lg:card-side bg-base-100">
        <figure>
          <img :src="filmDetails.imageURL" alt="Movie" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ filmDetails.title }}</h2>
          <p>Director: {{ filmDetails.director }}</p>
          <p>Release Date: {{ filmDetails.releaseDate }}</p>
          <p><strong>Description:</strong> {{ filmDetails.openingCrawl }}</p>
          <div class="card-actions justify-end">
            <router-link to="/" class="btn btn-primary hover:underline">Kembali</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { gql } from '@apollo/client/core';
import { useQuery } from '@vue/apollo-composable';
import { useRoute } from 'vue-router';
import fetchFilmImage from '../../utils/fetchFilmImage';

export default defineComponent({
  name: 'StarWarsData',
  setup() {
    const route = useRoute();
    const filmId = route.params.id;
    const filmDetails = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const GET_FILMS = gql`
      query {
        allFilms {
          films {
            id
            title
            director
            releaseDate
            openingCrawl
          }
        }
      }
    `;

    const { result, loading: queryLoading, error: queryError } = useQuery(GET_FILMS);
    const isLoading = ref(true);

    onMounted(async () => {
      if (!queryLoading.value && result.value) {
        loading.value = false;
        if (queryError.value) {
          error.value = queryError.value;
        } else {
          const film = result.value.allFilms.films.find((film) => film.id === filmId);
          if (film) {
            const imageURL = await fetchFilmImage(film.title);
            filmDetails.value = {
              ...film,
              imageURL,
            };
          }
          setTimeout(() => {
            isLoading.value = false;
          }, 1000);
        }
      }
    });

    return {
      filmDetails,
      loading: isLoading,
      error,
    };
  },
});
</script>
