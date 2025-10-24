<template>
  <div class="flex-col items-center justify-center m-10">
    <div class="drawing-canvas-container rounded-2xl shadow-xl bg-base-300 relative">
      <div v-if="strokes.length === 0"
        class="absolute inset-0 flex items-center justify-center text-base-content/50 font-bold text-2xl user-select-none pointer-events-none">
        Draw here 
      </div>

      <canvas ref="drawingCanvasRef" width="300" height="300"></canvas>
      <canvas ref="boundingBoxCanvasRef" class="hidden" width="300" height="300"></canvas>
      <canvas ref="centeredImageCanvasRef" class="hidden" width="300" height="300"></canvas>
      <canvas ref="pixelCanvasRef" class="hidden" width="28" height="28"></canvas>
    </div>
    <div class="flex justify-center">
      <button @click="clear" class="btn btn-primary m-10">Clear</button>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useDrawingCanvas } from "./drawingCanvas";

// Define props (if needed)
const props = defineProps({
  lineWidth: {
    type: Number,
    default: 12,
  },
});

// Define custom events
const emit = defineEmits(['update:grayscale']);

// Canvas references
const drawingCanvasRef = ref(null);
const boundingBoxCanvasRef = ref(null);
const centeredImageCanvasRef = ref(null);
const pixelCanvasRef = ref(null);

// Reactive states for strokes and grayscale values
const strokes = ref([]);
const grayscaleValues = ref(Array(784).fill(0));

// Initialize the drawing functionality
useDrawingCanvas(drawingCanvasRef, strokes, props.lineWidth);

function drawBoundingBox() {
  if (strokes.value.length === 0) return;
  const strokesFlatten = strokes.value.flat();
  const xValues = strokesFlatten.map((stroke) => stroke.x);
  const yValues = strokesFlatten.map((stroke) => stroke.y);

  const minX = Math.min(...xValues) - props.lineWidth / 2;
  const maxX = Math.max(...xValues) + props.lineWidth / 2;
  const minY = Math.min(...yValues) - props.lineWidth / 2;
  const maxY = Math.max(...yValues) + props.lineWidth / 2;

  const boundingBoxHeight = maxY - minY;
  const boundingBoxWidth = maxX - minX;
  const maxSide = Math.max(boundingBoxHeight, boundingBoxWidth);

  const boundingBoxCanvas = boundingBoxCanvasRef.value;
  const ctx = boundingBoxCanvas.getContext("2d", { willReadFrequently: true });
  ctx.clearRect(0, 0, boundingBoxCanvas.width, boundingBoxCanvas.height);
  ctx.drawImage(
    drawingCanvasRef.value,
    minX,
    minY,
    maxSide,
    maxSide,
    0,
    0,
    boundingBoxCanvas.width,
    boundingBoxCanvas.height
  );
}

function drawCenteredImage() {
  const boundingBoxCanvas = boundingBoxCanvasRef.value;
  const boundingBoxCtx = boundingBoxCanvas.getContext("2d", { willReadFrequently: true });
  const boundingBoxImageData = boundingBoxCtx.getImageData(
    0,
    0,
    boundingBoxCanvas.width,
    boundingBoxCanvas.height
  ).data;

  let sumX = 0;
  let sumY = 0;
  let pixelCount = 0;

  for (let y = 0; y < boundingBoxCanvas.height; y++) {
    for (let x = 0; x < boundingBoxCanvas.width; x++) {
      const pixelIndex = (y * boundingBoxCanvas.width + x) * 4;
      const isFilledPixel = boundingBoxImageData[pixelIndex + 3] > 0;
      if (isFilledPixel) {
        sumX += x;
        sumY += y;
        pixelCount++;
      }
    }
  }

  if (pixelCount === 0) return;

  const xCenterOfMass = sumX / pixelCount;
  const yCenterOfMass = sumY / pixelCount;
  const centeredCanvas = centeredImageCanvasRef.value;
  const centeredCtx = centeredCanvas.getContext("2d", { willReadFrequently: true });

  const mnistScaleFactor = 1 - 8 / 28;
  const scaledXCenter = xCenterOfMass * mnistScaleFactor;
  const scaledYCenter = yCenterOfMass * mnistScaleFactor;
  const offsetX = centeredCanvas.width / 2 - scaledXCenter;
  const offsetY = centeredCanvas.height / 2 - scaledYCenter;

  centeredCtx.clearRect(0, 0, centeredCanvas.width, centeredCanvas.height);
  centeredCtx.fillStyle = "black";
  centeredCtx.fillRect(0, 0, centeredCanvas.width, centeredCanvas.height);

  centeredCtx.drawImage(
    boundingBoxCanvas,
    offsetX,
    offsetY,
    boundingBoxCanvas.width * mnistScaleFactor,
    boundingBoxCanvas.height * mnistScaleFactor
  );
}

function drawPixelImage() {
  const pixelCtx = pixelCanvasRef.value.getContext("2d", { willReadFrequently: true });
  const centeredCanvas = centeredImageCanvasRef.value;
  pixelCtx.drawImage(centeredCanvas, 0, 0, 28, 28);

  const pixelData = pixelCtx.getImageData(0, 0, 28, 28).data;
  const pixels = [];
  for (let i = 0; i < pixelData.length; i += 4) {
    const pixel = [pixelData[i], pixelData[i + 1], pixelData[i + 2]];
    pixels.push(pixel);
  }
  // Compute grayscale values for each pixel
  const grayValues = pixels.map(([r, g, b]) => (r + g + b) / 3);
  grayscaleValues.value = grayValues;
  // Emit the new grayscale array for the parent component
  emit('update:grayscale', grayValues);
}

watch(
  strokes,
  (newVal) => {
    if (newVal.length === 0) return;
    drawBoundingBox();
    drawCenteredImage();
    drawPixelImage();
  },
  { deep: true }
);

function clearCanvas(canvasRef) {
  const ctx = canvasRef.value.getContext("2d");
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
}

function clear() {
  clearCanvas(drawingCanvasRef);
  clearCanvas(boundingBoxCanvasRef);
  clearCanvas(centeredImageCanvasRef);
  clearCanvas(pixelCanvasRef);
  strokes.value = [];
  grayscaleValues.value = Array(784).fill(0);
  emit('update:grayscale', grayscaleValues.value);
}
</script>

<style>
canvas {
  image-rendering: pixelated;
}
</style>