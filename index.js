import { SlideLibrary, UIManager } from './multimedia-slides-library';

// DOM-элементы
const slideContainer = document.getElementById('slide-container');
const toolsContainer = document.getElementById('tools-container');
const startRecordingButton = document.getElementById('start-recording-button');
const stopRecordingButton = document.getElementById('stop-recording-button');
const playbackButtonsContainer = document.getElementById('playback-buttons-container');
const rasterSlideButton = document.getElementById('raster-slide-button');
const videoSlideButton = document.getElementById('video-slide-button');

// Инициализация UIManager
const uiManager = new UIManager(slideContainer, toolsContainer);

// Создание экземпляра SlideLibrary
const slideLib = new SlideLibrary(uiManager);

// Переменные для хранения текущего слайда и записанных команд
let currentSlide = null;
let recordedCommands = new Map(); // Используем Map для хранения команд по ключам

// Инициализация примеров
let rasterSlide = null;
let videoSlide = null;


const backImage = './examples/img/first-image.jpg'

function initializeRasterSlide() {
    uiManager.clearUI()
    rasterSlide = slideLib.createSlide('raster', backImage);
    console.log('RasterSlide initialized');

    if (currentSlide && currentSlide !== rasterSlide) currentSlide.stopRecording();
    currentSlide = rasterSlide;
    setupControls();
    rasterSlideButton.classList.add('active');
    videoSlideButton.classList.remove('active');
}


const videoSrc = './examples/video/first-video.mp4';

function initializeVideoSlide() {
    uiManager.clearUI()
    videoSlide = slideLib.createSlide('video', videoSrc);
    console.log('VideoSlide initialized');

    if (currentSlide && currentSlide !== videoSlide) currentSlide.stopRecording();

    currentSlide = videoSlide;
    setupControls();
    videoSlideButton.classList.add('active');
    rasterSlideButton.classList.remove('active');
}

function setupControls() {
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;

    startRecordingButton.onclick = () => {
        const key = prompt('Введите название для этого набора команд:');
        if (key && currentSlide) {
            slideLib.startRecording(key);
            startRecordingButton.disabled = true;
            stopRecordingButton.disabled = false;
        }
    };

    stopRecordingButton.onclick = () => {
        if (currentSlide) {
            const recordingKey = slideLib.stopRecording();
            startRecordingButton.disabled = false;
            stopRecordingButton.disabled = true;
            const commands = currentSlide.getCommands();
            recordedCommands.set(recordingKey, commands);
            slideLib.createPlaybackButton(recordingKey, playbackButtonsContainer);
        }
    };

    // Обновление обработчиков воспроизведения для всех кнопок
    playbackButtonsContainer.querySelectorAll('button').forEach(button => {
        const key = button.dataset.key;
        button.onclick = () => {
            if (currentSlide && recordedCommands.has(key)) {
                currentSlide.commands = [...recordedCommands.get(key)];
                currentSlide.play();
            }
        };
    });
}

// Обработчики переключения
rasterSlideButton.onclick = () => {
    recordedCommands.clear();
    playbackButtonsContainer.innerHTML = '';
    initializeRasterSlide();
};

videoSlideButton.onclick = () => {
    recordedCommands.clear();
    playbackButtonsContainer.innerHTML = '';
    initializeVideoSlide();
};

// Инициализация по умолчанию
initializeRasterSlide();

// Обновление обработчиков воспроизведения после инициализации
setupControls();