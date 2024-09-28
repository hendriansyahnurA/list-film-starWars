<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold mb-6">Detail Karakter</h1>
    <span v-if="loading" class="loading loading-spinner loading-lg text-info"></span>
    <div v-else-if="error" class="text-red-500">Terjadi kesalahan: {{ error.message }}</div>
    <div v-else-if="character">
      <h2>{{ character.name }}</h2>
      <p><strong>Gender:</strong> {{ character.gender }}</p>
      <p><strong>Birth Year:</strong> {{ character.birthYear }}</p>
      <p><strong>Homeworld:</strong> {{ character.homeworld?.name }}</p>
      <h3 class="mt-4">Films Featuring {{ character.name }}</h3>
      <ul>
        <li v-for="film in character.filmConnection?.films" :key="film.id">
          <p><strong>Title:</strong> {{ film.title }} ({{ film.releaseDate }})</p>
        </li>
        <li v-if="!character.filmConnection?.films.length">No films found for this character.</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { gql } from '@apollo/client/core';
import { useQuery } from '@vue/apollo-composable';
import { useRoute } from 'vue-router';

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

export default defineComponent({
  name: 'CharacterDetails',
  setup() {
    const route = useRoute();
    const characterId = route.params.id;
    const loading = ref(true);
    const error = ref(null);
    const character = ref(null);
    console.log('Character ID:', characterId);

    const {
      result,
      loading: queryLoading,
      error: queryError,
    } = useQuery(GET_CHARACTER_WITH_FILMS, {
      variables: { id: characterId },
    });

    onMounted(() => {
      loading.value = queryLoading;

      if (result.value) {
        if (result.value.character) {
          character.value = result.value.character;
          console.log('Character Data:', character.value);
        } else {
          error.value = new Error('Character not found.');
        }
      }

      if (queryError.value) {
        console.error('GraphQL Error:', queryError.value);
        error.value = queryError.value;
      }
    });

    return {
      character,
      loading,
      error,
    };
  },
});
</script>
