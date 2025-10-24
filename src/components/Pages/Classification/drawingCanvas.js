// useDrawingCanvas.js
import { onMounted, onBeforeUnmount, ref } from "vue";

export function useDrawingCanvas(drawingCanvasRef, strokes, lineWidth) {
  const isDrawing = ref(false);
  const lastPosition = ref({ x: 0, y: 0 });
  const drawingCanvasCtx = ref(null);

  function initializeCanvas() {
    const drawingCanvas = drawingCanvasRef.value;
    if (!drawingCanvas) return;
    const ctx = drawingCanvas.getContext("2d");
    ctx.strokeStyle = "white";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;
    drawingCanvasCtx.value = ctx;
  }

  function startDrawing(x, y) {
    isDrawing.value = true;
    lastPosition.value = { x, y };
    // Push a new stroke (an array of points) into strokes
    strokes.value.push([{ x, y }]);
  }

  function draw(x, y) {
    if (!isDrawing.value || !drawingCanvasCtx.value) return;
    const ctx = drawingCanvasCtx.value;
    ctx.beginPath();
    ctx.moveTo(lastPosition.value.x, lastPosition.value.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPosition.value = { x, y };
    // Update the last stroke by adding the new point
    if (strokes.value.length) {
      strokes.value[strokes.value.length - 1].push({ x, y });
    }
  }

  function stopDrawing() {
    isDrawing.value = false;
  }

  function getOffsetPosition(event) {
    const drawingCanvas = drawingCanvasRef.value;
    if (!drawingCanvas) return { x: 0, y: 0 };
    const canvasRect = drawingCanvas.getBoundingClientRect();
    return {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top,
    };
  }

  function handleMouseDown(event) {
    if (event.button === 2) return;
    const { x, y } = getOffsetPosition(event);
    startDrawing(x, y);
  }

  function handleMouseMove(event) {
    if (!isDrawing.value) return;
    const { x, y } = getOffsetPosition(event);
    draw(x, y);
  }

  function handleMouseUp() {
    stopDrawing();
  }

  function handleTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const { x, y } = getOffsetPosition(touch);
    startDrawing(x, y);
  }

  function handleTouchMove(event) {
    event.preventDefault();
    if (!isDrawing.value) return;
    const touch = event.touches[0];
    const { x, y } = getOffsetPosition(touch);
    draw(x, y);
  }

  function handleTouchEnd() {
    stopDrawing();
  }

  onMounted(() => {
    initializeCanvas();
    const drawingCanvas = drawingCanvasRef.value;
    if (!drawingCanvas) return;

    drawingCanvas.addEventListener("mousedown", handleMouseDown);
    drawingCanvas.addEventListener("mousemove", handleMouseMove);
    drawingCanvas.addEventListener("mouseup", handleMouseUp);
    drawingCanvas.addEventListener("mouseleave", handleMouseUp);
    drawingCanvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    drawingCanvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    drawingCanvas.addEventListener("touchend", handleTouchEnd);

    onBeforeUnmount(() => {
      drawingCanvas.removeEventListener("mousedown", handleMouseDown);
      drawingCanvas.removeEventListener("mousemove", handleMouseMove);
      drawingCanvas.removeEventListener("mouseup", handleMouseUp);
      drawingCanvas.removeEventListener("mouseleave", handleMouseUp);
      drawingCanvas.removeEventListener("touchstart", handleTouchStart);
      drawingCanvas.removeEventListener("touchmove", handleTouchMove);
      drawingCanvas.removeEventListener("touchend", handleTouchEnd);
    });
  });
}
