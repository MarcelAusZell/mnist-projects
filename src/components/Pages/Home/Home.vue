<template>
  <div class="relative min-h-screen">
    <div class="absolute inset-0 overflow-hidden blur-[10px] flex justify-center items-center pointer-events-none">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-5xl p-4">
        <div v-for="(data, digit) in digitData" :key="digit" class="flex flex-col items-center">
          <div class="overflow-hidden bg-base-100 w-full aspect-square" :style="gridStyle">
            <div v-for="(value, index) in getGridData(data)" :key="index" :style="{
              backgroundColor: 'var(--color-base-content)',
              opacity: `${value / 255}`,
              width: '100%',
              height: '100%'
            }">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="relative flex justify-center items-center h-screen"> <div
        class="bg-base-100/60 rounded-xl shadow-xl  max-w-3xl flex flex-col items-center shadow-xl border border-base-content/10 ">
        <p class="text-xl text-center m-4">
          Welcome to my handwritting recognition demo
        </p>
        <Logo width="400px" fill="var(--color-primary)" class="text-center" />

        <p class="text-xl text-center m-4">
          Explore handwritten recognition using my self trained machine learning models using the
          <a href="http://yann.lecun.com/exdb/mnist/" class="link link-hover">MNIST</a> (and other similar) datasets.
          Have fun!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Logo from '../../../assets/Logo.vue';
import {
  mnist0, mnist1, mnist2, mnist3, mnist4, mnist5, mnist6, mnist7, mnist8, mnist9,
  mnist10, mnist11, mnist12, mnist13, mnist14, mnist15
} from '../../../assets/handwritten-digits/handwritten-digits';

const gridSize = 28;

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
  gridTemplateRows: `repeat(${gridSize}, 1fr)`
}));

const digitData = {
  mnist0,
  mnist1,
  mnist2,
  mnist3,
  mnist4,
  mnist5,
  mnist6,
  mnist7,
  mnist8,
  mnist9,
  mnist10,
  mnist11,
  mnist12,
  mnist13,
  mnist14,
  mnist15,
};

function getGridData(digitArray) {
  return digitArray;
}
</script>

<style scoped>
.backdrop-blur-lg {
  --tw-backdrop-blur: blur(16px);
  backdrop-filter: var(--tw-backdrop-blur);
}
</style>