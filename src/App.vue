<template>
  <div id="app">
    <md-toolbar class="md-primary">
      <div class="md-toolbar-row">
        <md-button @click="showNavigation = true" class="md-icon-button" md-menu-trigger>
          <md-icon>menu</md-icon>
        </md-button>
        <div class="md-toolbar-section-start">
        </div>
        <div class="md-toolbar-section-end">
        </div>
      </div>
    </md-toolbar>
    <router-view/>
    <md-drawer class="md-left" :md-active.sync="showNavigation">
      <md-toolbar :md-elevation="1">
        <span class="md-title">Меню</span>
      </md-toolbar>
      <md-subheader>Навигация</md-subheader>
      <md-button class="md-icon-button">
        <router-link to="/">
          <md-icon>first_page</md-icon>
        </router-link>
      </md-button>
      <md-button class="md-icon-button">
        <router-link to="/about">
          <md-icon>map</md-icon>
        </router-link>
      </md-button>
      <md-button class="md-icon-button">
        <router-link to="/example">
          <md-icon>explore</md-icon>
        </router-link>
      </md-button>
      <md-divider></md-divider>
      <md-list class="md-double-line">
        <md-subheader>Контакты</md-subheader>
        <md-list-item>
          <md-icon class="md-primary">email</md-icon>
          <div class="md-list-item-text">
            <span>palexei98@gmail.com</span>
            <span>Personal</span>
          </div>
        </md-list-item>
      </md-list>
    </md-drawer>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data: () => ({
      showNavigation: false,
    })
  }
</script>

<style>

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }

  .page-container {
    min-height: 300px;
    overflow: hidden;
    position: relative;
    border: 1px solid green;
  }

  // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-content {
    padding: 16px;
  }
</style>
