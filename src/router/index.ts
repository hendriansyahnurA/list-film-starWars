import { createRouter, createWebHistory } from 'vue-router';
import FilmsList from '../view/FilmsList.vue';
import CharacterFilm from '../view/CharacterFilm.vue';
import StarWarsData from '../components/details/StarWarsData.vue';
import CharacterDetails from '../components/details/CharacterDetails.vue';
import SearchResults from '../components/Search/SearchResults.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: FilmsList,
  },
  {
    path: '/character',
    name: 'Character',
    component: CharacterFilm,
  },
  {
    path: '/film/:id',
    component: StarWarsData,
    props: true,
  },
  {
    path: '/character/:id',
    component: CharacterDetails,
    props: true,
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
