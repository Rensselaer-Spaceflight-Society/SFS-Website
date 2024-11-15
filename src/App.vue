<script setup lang="ts">
  import NavMenu from './components/NavMenu.vue'
</script>

<template>
  <nav>
    <RouterLink id="logoContainer" class="logo" to="/">
      <img id="logoImg" src="./assets/logo.svg" alt=""/>
    </RouterLink>
    <NavMenu id="NavMenu">
      <li>
        <RouterLink class="navsection" to="/">Home</RouterLink>
        <RouterLink class="navsection" to="/about">About</RouterLink>
        <a class="navsection" href="https://discord.gg/Y8uVhAqGsQ">Discord</a>
      </li>
    </NavMenu>
  </nav>
  <br>
  <RouterView class="page" />
</template>

<style scoped>

  .page{
    position: relative
  }

  nav{
    height: 3rem;
  }

  .logo {
    display: block;
    z-index: 4;
    position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    height: 60px;
  }

  #NavMenu{
    display: flex;
    position: absolute;
    float: right;
    height: 3rem;
    width: 100vw;
    right: 0;
  }

  #logoImg{
    max-width: 100%;
    max-width: 100%;
    height: auto;
    width: auto;
    display: flex;
  }

  @media ( min-width: 1020px) {
    header {
      display: flex;
      place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }

    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }

  }
</style>
