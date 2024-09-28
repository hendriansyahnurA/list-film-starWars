<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-3xl font-bold mb-6">Daftar Karakter Star Wars</h1>
    <span v-if="loading" class="loading loading-spinner loading-lg text-info"></span>
    <div v-else-if="error" class="text-red-500">Terjadi kesalahan: {{ error.message }}</div>
    <div v-else>
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <li
          v-for="character in paginatedCharacters"
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
      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="handlePageChange" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { gql } from '@apollo/client/core';
import { useQuery } from '@vue/apollo-composable';
import fetchCharacterImage from '../utils/fetchCharacterImage.ts';
import router from '../router/index.ts';
import Pagination from '../components/Pagination/Pagination.vue';

export default defineComponent({
  name: 'CharacterFilm',
  components: { Pagination },
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
    const charactersPerPage = 6;
    const currentPage = ref(1);

    const totalPages = computed(() => Math.ceil(characters.value.length / charactersPerPage));
    const paginatedCharacters = computed(() => {
      const start = (currentPage.value - 1) * charactersPerPage;
      const end = start + charactersPerPage;
      return characters.value.slice(start, end);
    });

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
      }
    });

    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    const gotoCharacterDetail = (characterId: string) => {
      router.push({ path: `/character/${characterId}` });
    };

    return {
      characters,
      paginatedCharacters,
      currentPage,
      totalPages,
      loading,
      error,
      gotoCharacterDetail,
      handlePageChange,
    };
  },
});
</script>
