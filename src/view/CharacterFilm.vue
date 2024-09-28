<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-3xl font-bold mb-6">Daftar Karakter Star Wars</h1>
    <span v-if="loading" class="loading loading-spinner loading-lg text-info"></span>
    <div v-else-if="error" class="text-red-500">Terjadi kesalahan: {{ error.message }}</div>
    <div v-else>
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <li
          v-for="character in characters"
          :key="character.id"
          class="card bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <figure class="px-10 pt-10">
            <img :src="character.imageURL" alt="Character Image" class="w-full h-48 object-cover mb-4 rounded-lg" />
          </figure>
          <div class="card-body p-6">
            <h3 class="card-title text-xl font-bold">{{ character.name }}</h3>
            <p><strong>Gender:</strong> {{ character.gender }}</p>
            <p><strong>Birth Year:</strong> {{ character.birthYear }}</p>
            <p><strong>Homeworld:</strong> {{ character.homeworld.name }}</p>
            <div class="card-actions mt-4">
              <button @click="gotoCharacterDetail(character.id)" class="btn btn-primary">Lihat Film</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { gql } from '@apollo/client/core';
import { useQuery } from '@vue/apollo-composable';
import fetchCharacterImage from '../utils/fetchCharacterImage.ts';
import router from '../router/index.ts';

export default defineComponent({
  name: 'CharacterFilm',
  setup() {
    const GET_ALL_CHARACTERS = gql`
      query GetAllCharactersWithFilms {
        allPeople {
          people {
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
      }
    `;

    const { result, loading, error } = useQuery(GET_ALL_CHARACTERS);
    const characters = ref<any[]>([]);
    const selectedCharacter = ref<any>(null);
    const isModalVisible = ref(false);
    const isLoading = ref(true);

    onMounted(async () => {
      if (result.value && result.value.allPeople && result.value.allPeople.people) {
        characters.value = await Promise.all(
          result.value.allPeople.people.map(async (character: any) => {
            const imageURL = await fetchCharacterImage(character.name);
            return {
              ...character,
              imageURL,
            };
          })
        );
        setTimeout(() => {
          isLoading.value = false;
        }, 1000);
      }
    });

    const gotoCharacterDetail = (characterId: string) => {
      router.push({ path: `/character/${characterId}` });
    };

    return {
      characters,
      loading: isLoading,
      error,
      gotoCharacterDetail,
      selectedCharacter,
      isModalVisible,
    };
  },
});
</script>
