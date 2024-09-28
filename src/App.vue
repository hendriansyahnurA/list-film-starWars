<template>
  <div id="app">
    <Navbar>
      <div>
        <Header />
      </div>
      <router-view />
    </Navbar>
  </div>
</template>

<script>
import Navbar from './components/Layouts/Navbar.vue';
import Header from './components/Layouts/Header.vue';
export default {
  name: 'App',
  components: {
    Navbar,
    Header,
  },
};
</script>
