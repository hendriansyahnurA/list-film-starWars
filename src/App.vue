<template>
  <div id="app">
    <Navbar>
      <router-view />
    </Navbar>
  </div>
</template>

<script>
import Navbar from './components/Layouts/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
};
</script>
