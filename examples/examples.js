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


const resizeButton = document.getElementById('resize-slide-button');



// Переменные для хранения текущего слайда и записанных команд
let currentRecordingSlide = null;
let currentPlayingSlide = null;

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
    rasterSlide = await slideLib.createSlide('raster', backImage);
    console.log('RasterSlide initialized');

    // if (currentRecordingSlide && currentRecordingSlide !== rasterSlide)
        // currentRecordingSlide.stopRecording();

    currentRecordingSlide = rasterSlide;
    setupControls();
    rasterSlideButton.classList.add('active');
    videoSlideButton.classList.remove('active');
    textSlideButton.classList.remove('active');
}


const videoSrc = './examples/video/first-video.mp4';

async function initializeVideoSlide() {
    videoSlide = await slideLib.createSlide('video', videoSrc);
    console.log('VideoSlide initialized');

    // if (currentRecordingSlide && currentRecordingSlide !== videoSlide)
        // currentRecordingSlide.stopRecording();

    currentRecordingSlide = videoSlide;
    setupControls();
    videoSlideButton.classList.add('active');
    rasterSlideButton.classList.remove('active');
    textSlideButton.classList.remove('active');
}

async function initializeTextSlide() {
    textSlide = await slideLib.createSlide('text', backImage);
    console.log('TextSlide initialized');

    // if (currentRecordingSlide && currentRecordingSlide !== textSlide) currentRecordingSlide.stopRecording();
    currentRecordingSlide = textSlide;
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
        if (key && currentRecordingSlide) {
            slideLib.startRecording(key, currentRecordingSlide);
            startRecordingButton.disabled = true;
            stopRecordingButton.disabled = false;
        }
    };

    stopRecordingButton.onclick = () => {
        if (currentRecordingSlide) {
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

resizeButton.onclick = () => {
    if (!currentRecordingSlide) return;

    // slideLib.doResize()
    // currentRecordingSlide — это Promise<Slide>
    // currentRecordingSlide
    //     .then(slide => {
    //         if (slide?.doResize) slide.doResize();
    //     })
    //     .catch(err => console.error("Не удалось получить слайд:", err));

    // currentRecordingSlide.doResize()
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