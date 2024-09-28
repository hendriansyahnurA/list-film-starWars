<template>
  <div class="flex justify-between items-center p-5">
    <h1 class="text-3xl font-bold underline underline-offset-8">List Karakter Star Wars</h1>
    <router-link to="/" class="btn btn-warning hover:underline">Back</router-link>
  </div>
  <div class="items-center justify-center py-2">
    <span v-if="loading" class="loading loading-spinner loading-lg warning"></span>
    <div v-else-if="error" class="text-red-500">Terjadi kesalahan: {{ error.message }}</div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="character in paginatedCharacters"
          :key="character.id"
          class="card bg-gray-900 card-compact shadow-xl min-w-[250px]"
        >
          <figure>
            <img :src="character.imageURL" alt="Character Image" class="w-full h-48 object-cover" />
          </figure>
          <div class="card-body h-auto">
            <h3 class="card-title text-xl font-bold">{{ character.name }}</h3>
            <p><strong>Gender:</strong> {{ character.gender }}</p>
            <p><strong>Birth Year:</strong> {{ character.birthYear }}</p>
            <p><strong>Homeworld:</strong> {{ character.homeworld.name }}</p>
            <div class="card-actions">
              <Button label="Detail" @click="gotoCharacterDetail(character.id)" />
            </div>
          </div>
        </div>
      </div>
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
import Button from '../components/ButtonComponents/Button.vue';
export default defineComponent({
  name: 'CharacterFilm',
  components: { Pagination, Button },
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
    const charactersPerPage = 8;
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
