<script setup lang="ts">



</script>

<template>

<div id="titleContent">
  <img id="titleImage" src="https://placehold.co/2560x1440" alt="">
  <h1 id="mainTitle">Rensselaer Spaceflight Society</h1>
  <br>
  <p id="mainDescription">
    Rensselaer Spaceflight Society strives to increase student involvement in the ever-growing aerospace field through five hands-on science and engineering projects, including developing RPI’s first liquid bi-propellant rocket engine. 
    We recently began designing a CubeSat to compete in NASA’s CubeSat Launch Initiative and conduct research in low Earth orbit. 
    Our Lunar R&D project carries out experiments to uncover the physical properties of lunar regolith for space manufacturing purposes. 
    Additionally, we work on the iterative design of an autonomous high-precision lander and are constructing an all-terrain rover capable of collecting soil samples and other data. 
    We help develop on-campus safety regulations and do outreach in the Rensselaer community to further interest and involvement in space.
  </p>
  
</div>

</template>

<style>

  #titleImage{
    max-height: 40rem;
    width: 100vw;
    left: -7.5vw;
    top: -64px;
    z-index: -1;
    object-fit: cover;
    position: absolute;
  }
  
  #titleContent{
    width: calc(90vw - 64px);
    height: fit-content;
    height: 45rem;
  }

  #mainTitle{
    text-align: center;
    font-size: 7rem;
    margin-top: 3rem;
    margin-bottom: 10rem;
  }

  #mainDescription{
    font-size: 2rem;
  }

</style>