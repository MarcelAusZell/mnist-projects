<template>
  <strong class="flex justify-center text-4xl">EMNIST Letter Recognition</strong>
  <div class="flex flex-col 2xl:flex-row items-center justify-center bg-base-200 rounded-2xl shadow-xs m-10">
    <CanvasPreprocessing @update:grayscale="handleGrayscaleUpdate" />
    <PredictionVisualizing :grayscale="grayscale" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import CanvasPreprocessing from "../CanvasPreprocessing.vue";
import PredictionVisualizing from "./PredictionVisualizing.vue";


const grayscale = ref([]);

function handleGrayscaleUpdate(newGrayscale) {
  grayscale.value = newGrayscale;
}
</script>
