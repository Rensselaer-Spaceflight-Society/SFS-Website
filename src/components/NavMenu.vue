<script lang="ts">
import { ref } from 'vue';

export default {
    setup(){
        let visibility = ref(true);

        return { visibility };
    }
}
</script>

<template>
    <div type="button" class="navbutton" @click="visibility=!visibility">{{ visibility ? 'Menu' : 'Close' }}</div>
    <div id="navScreen" v-show="!visibility" @click="visibility=!visibility"> 
        <slot></slot>
    </div>
</template>

<style>

    .navbutton{
        display: block;
        position: absolute;
        z-index: 4;
        right: 1rem;
        background-color: transparent;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        color: rgba(235, 235, 235, 0.64);
        border: 0;
        font-size: 1.75rem;
        height: fit-content;
        width: fit-content;
    }

    .navbutton:hover{
        opacity: 0.5;
    }

    .navsection{
        display: block;
        position: relative;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        font-size: 1.75rem;
        opacity: 2.0;
    }

    #navScreen{
        display: flex;
        left: 0;
        z-index: 3;
        position: absolute;
        height: 100vh;
        text-align: center;
        justify-content: center;
        width: 100vw;
        background-color: #000000;
        opacity: 0.5;
    }

</style>