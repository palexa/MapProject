<template>
  <div class="home">
    <img style="height: 20vh" alt="Vue logo" src="../assets/geo.png">
    <Login/>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login.vue';

export default {
  name: 'home',
  components: {
    Login,
  },
};
</script>
