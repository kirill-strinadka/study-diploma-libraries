// examples/raster-slide/example1/example.js
import {SlideFactory} from "../../../slide-sync/modules/SlideFactory.js";
import {SlideDTO} from "../../../slide-sync/modules/utils/SlideDTO.js";

// DOM-элементы
const slideContainer = document.getElementById('slide-container');
const videoPlayer = document.getElementById('video-container');
const goBackButton = document.getElementById('go-back-button');
const example1Button = document.getElementById('example1-button');
const playExampleButton = document.getElementById('play-example-button');

// Создание экземпляра SlideLibrary
const slideFactory = new SlideFactory(slideContainer);

// Переменные для хранения слайдов и команд примера
let rasterSlide = null;
let videoElement = null;
let exampleCommands = null;

async function loadExample() {

    // Загрузка JSON с командами для растрового слайда
    const response = await fetch('./examples/raster/example1/example.json');
    exampleCommands = await response.json(); // Сохраняем команды для рисования

    // Инициализация растрового слайда с фоном из example.png
    let slideDTO = new SlideDTO(exampleCommands, './examples/raster/example1/example.png', 'raster');
    rasterSlide = await slideFactory.createPlaybackSlide(slideDTO);
    console.log('RasterSlide initialized with commands:', exampleCommands);

    // Создание и настройка элемента <video-slide>
    videoElement = document.createElement('video');
    videoElement.src = './examples/raster/example1/example.mkv';
    videoElement.controls = false; // Добавляем элементы управления (опционально)
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    videoPlayer.appendChild(videoElement);
    console.log('Video element initialized');

    playExampleButton.disabled = false;
}

function setupExampleControls() {
    playExampleButton.onclick = () => {
        if (rasterSlide && videoElement && exampleCommands) {
            // Установка и воспроизведение команд для растрового слайда
            rasterSlide.play();

            // Воспроизведение видео
            videoElement.play().catch(error => console.error('Error playing video-slide:', error));
            console.log('Playing example commands (raster-slide) and video-slide:', exampleCommands);
        }
    };
}

// Обработчики
goBackButton.onclick = () => {
    window.location.href = 'index.html';
};

example1Button.onclick = () => {
    loadExample().then(() => setupExampleControls());
};
