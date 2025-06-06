import {SlideLibraryUsage} from "./SlideLibraryUsage.js";

// DOM-элементы
const slideContainer = document.getElementById('slide-container');
const toolsContainer = document.getElementById('tools-container');
const startRecordingButton = document.getElementById('start-recording-button');
const stopRecordingButton = document.getElementById('stop-recording-button');
const playbackButtonsContainer = document.getElementById('playback-buttons-container');
const rasterSlideButton = document.getElementById('raster-slide-button');
const videoSlideButton = document.getElementById('video-slide-button');
const textSlideButton = document.getElementById('text-slide-button');


// Переменные для хранения текущего слайда и записанных команд
let currentSlide = null;

// Инициализация примеров
let rasterSlide = null;
let textSlide = null;
let videoSlide = null;


const backImage = './examples/img/first-image.jpg'
// const backImage = './examples/raster-slide/example1/example.png'

const slideModules = {
    'text': '../slide-sync/text-slide/RecordingRasterSlide.js'
}

// Создание экземпляра SlideLibrary
const slideLib = new SlideLibraryUsage(slideContainer, toolsContainer, slideModules);

async function initializeRasterSlide() {
    rasterSlide = slideLib.createSlide('raster', backImage);
    console.log('RasterSlide initialized');

    if (currentSlide && currentSlide !== rasterSlide) currentSlide.stopRecording();
    currentSlide = rasterSlide;
    setupControls();
    rasterSlideButton.classList.add('active');
    videoSlideButton.classList.remove('active');
    textSlideButton.classList.remove('active');
}


const videoSrc = './examples/video/first-video.mp4';

async function initializeVideoSlide() {
    videoSlide = slideLib.createSlide('video', videoSrc);
    console.log('VideoSlide initialized');

    if (currentSlide && currentSlide !== videoSlide) currentSlide.stopRecording();

    currentSlide = videoSlide;
    setupControls();
    videoSlideButton.classList.add('active');
    rasterSlideButton.classList.remove('active');
    textSlideButton.classList.remove('active');
}

async function initializeTextSlide() {
    textSlide = slideLib.createSlide('text', backImage);
    console.log('TextSlide initialized');

    if (currentSlide && currentSlide !== textSlide) currentSlide.stopRecording();
    currentSlide = textSlide;
    setupControls();
    textSlideButton.classList.add('active');
    videoSlideButton.classList.remove('active');
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
        if (currentSlide) {1
            const recordingKey = slideLib.stopRecording();
            startRecordingButton.disabled = false;
            stopRecordingButton.disabled = true;
            slideLib.createPlaybackButton(recordingKey, playbackButtonsContainer);
        }
    };

}

// Обработчики переключения
rasterSlideButton.onclick = async() => {
    slideLib.clearStorage()
    playbackButtonsContainer.innerHTML = '';
    await initializeRasterSlide();
};

videoSlideButton.onclick = async() => {
    slideLib.clearStorage()
    playbackButtonsContainer.innerHTML = '';
    await initializeVideoSlide();
};

textSlideButton.onclick = async() => {
    slideLib.clearStorage()
    playbackButtonsContainer.innerHTML = '';
    await initializeTextSlide();
};


// Обработчик для перехода к примерам
const goToExamplesButton = document.getElementById('go-to-examples-button');

goToExamplesButton.onclick = () => {
    window.location.href = 'examples.html';
};

// Инициализация по умолчанию
initializeRasterSlide().then(() => setupControls());

// Обновление обработчиков воспроизведения после инициализации
setupControls();