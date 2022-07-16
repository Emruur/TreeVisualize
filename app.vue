<script setup lang="ts">
import BST from "~/lib/BST"

const { width, height } = useScreenDimensions()
const canvas = ref(null)
const inputData = ref()

const tree = new BST<number>()
tree.add(1)
tree.add(2)
tree.add(4)
tree.add(23)

let pan = {
    startX: null,
    startY: null
}

function zoomIn() {
    let ctx = canvas.value.getContext("2d")
    ctx.translate(-10, -10)
    ctx.scale(1.1, 1.1)
    clearCanvas()
    draw()
}
function zoomOut() {
    let ctx = canvas.value.getContext("2d")
    ctx.scale(0.9, 0.9)
    ctx.translate(10, 10)
    clearCanvas()
    draw()
}


function panCanvas(x: number, y: number) {
    canvas.value.getContext("2d").translate(x, y)
    clearCanvas()
    draw()
}

function add() {
    tree.add(inputData.value)
    clearCanvas()
    draw()
}

function remove() {
    tree.remove(inputData.value)
    clearCanvas()
    draw()
}

onMounted(() => {
    canvas.value.addEventListener("mousedown", startPan);
    canvas.value.addEventListener("mouseleave", endPan);
    canvas.value.addEventListener("mouseup", endPan);
    document.body.style.cursor = "grab"
})

function startPan(e) {
    canvas.value.addEventListener("mousemove", trackMouse);
    canvas.value.addEventListener("mousemove", draw);
    pan.startX = e.clientX;
    pan.startY = e.clientY;
    document.body.style.cursor = "grabbing"
}
function endPan(e) {
    canvas.value.removeEventListener("mousemove", trackMouse);
    canvas.value.removeEventListener("mousemove", draw);
    pan.startX = null;
    pan.startY = null;
    document.body.style.cursor = "grab"
}
function trackMouse(e) {
    var offsetX = e.clientX - pan.startX;
    var offsetY = e.clientY - pan.startY;
    pan.startX = e.clientX;
    pan.startY = e.clientY;
    panCanvas(offsetX, offsetY)
}



onUpdated(() => {
    draw()
})

function draw() {
    if (canvas.value)
        tree.drawTree(canvas.value.getContext("2d"), width.value)
}

function clearCanvas() {
    let context = canvas.value.getContext("2d")
    context.save();

    // Use the identity matrix while clearing the canvas
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.value.width, canvas.value.height);

    // Restore the transform
    context.restore();
}
</script>

<template>
    <div class="container">
        <div class="input-bar">
            <form @submit.prevent="">
                <button @click="remove" class="input-btn">-</button>
                <input v-model="inputData" type="text" placeholder="enter here...">
                <button @click="add" class="input-btn">+</button>
            </form>
            <div class="zoom-container"><svg class="zoom" @click.prevent="zoomOut" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
                <svg class="zoom" xmlns="http://www.w3.org/2000/svg" @click.prevent="zoomIn" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
            </div>

        </div>
        <canvas ref="canvas" :width="width" :height="height"></canvas>

    </div>
</template>

<style scoped>
canvas {
    margin: 0;
    padding: 0;
    background-color: rgb(34, 47, 62);
}

.container {
    height: 100vh;
}

.input-bar {
    position: absolute;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

input {
    height: 2em;
    width: 9em;
    border: 3px solid #9dcded;
    background-color: #172026;
    border-radius: 5px;
    text-align: center;
    color: antiquewhite;
    font-family: Verdana;
    font-weight: bold;
    font-size: 13px;
}

.input-btn {
    border-radius: 100%;
    width: 3em;
    height: 3em;
    margin-inline: 1em;
    color: antiquewhite;
    background-color: #172026;
    border: 2px solid #9dcded;
    cursor: pointer;
    transition-duration: 75ms;
    font-size: 13px;
}


.input-btn:hover {
    border: 4px solid #9dcded;
    font-weight: bold;
}

form {
    background-color: #172026;
    border: 2px solid #9dcded;
    border-bottom-left-radius: 13px;
    border-bottom-right-radius: 13px;
    border-top: 0;
    padding: 0.7em;
    cursor: default;
}

.zoom {
    height: 2em;
    width: 2em;
    color: #9dcded;
    margin-inline: 0.4em;
    cursor: pointer;
    transition-duration: 100ms;
}
.zoom:hover{
    transform: scale(1.1);
}
.zoom-container{
    margin-left: 2em;
    margin-top: 0.2em;
    cursor: default;
    background-color: #172026;
    padding: 0.5em;
    border: 2px solid #9dcded;
    border-radius: 1em;
    display: flex;
    align-content: center;
}
</style>

<style>
body {
    margin: 0;
    padding: 0;
    user-select: none;
}
</style>