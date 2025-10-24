<template>
  <div class="flex-col w-full items-center justify-center m-10">
    <div class="rounded-2xl overflow-hidden shadow-xl bg-black mx-auto mb-5" :style="gridStyle">
      <div v-for="(value, index) in props.grayscale" :key="index" :style="{
        backgroundColor: `rgb(${value}, ${value}, ${value})`,
        border: `0.5px solid rgb(${value}, ${value}, ${value})`,
        width: '100%',
        height: '100%'
      }"></div>
    </div>
    <div class="flex justify-center items-center w-full h-auto">
      <svg ref="svgRef" viewBox="0 0 100 40"
        class="w-full h-auto max-w-[1000px] max-h-[500px] select-none block cursor-pointer">
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref, onMounted, toRaw } from "vue";
import * as tf from "@tensorflow/tfjs";
import * as d3 from "d3";

const props = defineProps({
  grayscale: {
    type: Array,
    default: () => Array(784).fill(0)
  }
});

const modelRef = ref(null);
const modelLoaded = ref(false);
const predictedNumber = ref(null);
const predictions = ref(Array.from({ length: 10 }, (_, i) => ({ group: i, value: 0 })));
const svgRef = ref(null);

const gridSize = 28;
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
  gridTemplateRows: `repeat(${gridSize}, 1fr)`,
  width: '100px',
  height: '100px'
}));

// Loading the model
onMounted(async () => {
  try {
    const modelPath = `${import.meta.env.BASE_URL}models/mnist-model/model.json`;
    console.log("Loading model from:", modelPath); // Good for debugging
    
    const model = await tf.loadLayersModel(modelPath);
    modelRef.value = model;
    modelLoaded.value = true;
  } catch (error) {
    console.error("Error loading model:", error);
    modelLoaded.value = false;
  }
});

watch(
  [() => props.grayscale, modelLoaded],
  async ([newGrayscale, newModelLoaded]) => {
    if (modelRef.value && newGrayscale) {
      const prediction = await predict(newGrayscale);
      plotHistogram();
    }
  },
)

// Predicting with model 
async function predict(grayscaleValues) {
  if (grayscaleValues.length == 0) {
    grayscaleValues = Array(784).fill(0);
  }
  const input = tf.tensor4d(grayscaleValues, [1, 28, 28, 1]).div(255.0);
  const rawModel = toRaw(modelRef.value);
  const prediction = rawModel.predict(input).dataSync();
  predictedNumber.value = prediction.indexOf(Math.max(...prediction));
  predictions.value = Array.from(prediction).map((probability, i) => ({
    group: i,
    value: Math.round(probability * 100)
  }));
  input.dispose();
  return prediction;
}

function plotHistogram() {
  const data = predictions.value;
  const svg = d3.select(svgRef.value);
  const maxValue = Math.max(...data.map(d => d.value));

  // Set up scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.group))
    .range([4, 96]);
  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([34, 0]);

  // Update bars
  svg.selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.group))
    .attr("y", d => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", d => Math.max(34 - yScale(d.value) - 0.25, 0))
    .attr("fill", "var(--color-primary)");

  // Remove old axis
  svg.select(".x-axis").remove();

  // Create new axis
  svg.append("g")
    .attr("transform", `translate(0,34)`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(xScale).tickSize(0).tickPadding(1))
    .selectAll("text")
    .style("font-family", "monospace")
    .style("font-size", "2px")
    .attr("fill", (_, i) => data[i].value === maxValue ? "var(--color-primary)" : "var(--color-base-content)")
    .each(function (_, i) {
      d3.select(this)
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "1.2em")
        .text(data[i].value + "%")
        .style("font-size", "1.5px")
        .style("opacity", 0.4)
    });
}
</script>