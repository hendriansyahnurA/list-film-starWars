<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold mb-6">Detail Karakter</h1>
    <span v-if="loading" class="loading loading-spinner loading-lg text-info"></span>
    <div v-else-if="error" class="text-red-500">Terjadi kesalahan: {{ error.message }}</div>
    <div v-else-if="CharacterDetails" class="card lg:card-side bg-base-100 shadow-xl">
      <figure>
        <img
          v-if="CharacterDetails.imageURL"
          :src="CharacterDetails.imageURL"
          alt="Character Image"
          class="object-cover w-96 h-96 rounded-md"
        />
        <img
          v-else
          src="https://via.placeholder.com/400x300?text=No+Image"
          alt="Placeholder Image"
          class="object-cover w-96 h-96"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">{{ CharacterDetails.name }}</h2>
        <p><strong>Gender:</strong> {{ CharacterDetails.gender }}</p>
        <p><strong>Birth Year:</strong> {{ CharacterDetails.birthYear }}</p>
        <p><strong>Homeworld:</strong> {{ CharacterDetails.homeworld?.name }}</p>

        <div class="mt-4">
          <h3 class="text-lg font-bold">Films Featuring {{ CharacterDetails.name }}</h3>
          <ul
            v-if="CharacterDetails.filmConnection && CharacterDetails.filmConnection.films.length > 0"
            class="list-none p-0"
          >
            <li v-for="film in CharacterDetails.filmConnection.films" :key="film.id">
              <p><strong>Title:</strong> {{ film.title }} ({{ film.releaseDate }})</p>
            </li>
          </ul>
          <p v-else>No films found for this character.</p>
        </div>
        <div class="card-actions justify-end">
          <router-link to="/character" class="btn btn-warning hover:underline">Back</router-link>
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
import fetchCharacterImage from '../../utils/fetchCharacterImage';

interface Film {
  id: string;
  title: string;
  releaseDate: string;
}

interface Homeworld {
  name: string;
}

interface Character {
  id: string;
  name: string;
  gender: string;
  birthYear: string;
  homeworld: Homeworld;
  filmConnection: {
    films: Film[];
  };
  imageURL?: string;
}

export default defineComponent({
  name: 'CharacterDetails',
  setup() {
    const route = useRoute();
    const characterId = route.params.id;
    const CharacterDetails = ref<Character | null>(null);
    const loading = ref(true);
    const error = ref<Error | null>(null);

    const GET_CHARACTER_WITH_FILMS = gql`
      query GetCharacterWithFilms($id: ID!) {
        person(id: $id) {
          id
          name
          gender
          birthYear
          homeworld {
            name
          }
          filmConnection {
            films {
              id
              title
              releaseDate
            }
          }
        }
      }
    `;

    const {
      result,
      loading: queryLoading,
      error: queryError,
    } = useQuery(GET_CHARACTER_WITH_FILMS, {
      id: characterId,
    });

    onMounted(async () => {
      if (!queryLoading.value && result.value) {
        loading.value = false;
        if (queryError.value) {
          error.value = queryError.value;
        } else if (result.value && result.value.person) {
          const character = result.value.person;
          const imageURL = await fetchCharacterImage(character.name);
          CharacterDetails.value = {
            ...character,
            imageURL,
          };
        }
      }
    });

    return {
      CharacterDetails,
      loading,
      error,
    };
  },
});
</script>
