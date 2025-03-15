// import { SlideLibrary2D } from '../diploma-libs/slide-raster-graphics/index.js';
// import { UIManager } from '../diploma-libs/control-application/UIManager.js';
//
//
// const slideHtmlElement = document.getElementById('slide-container');
// const toolsHtmlElement = document.getElementById('tools-container');
// const slideBackgroundImageSrc = './img/first-image.jpg';
//
// let uiManager = new UIManager(slideHtmlElement, toolsHtmlElement);
// uiManager.setBackGroundImage(slideBackgroundImageSrc);
//
// const slideLibrary = new SlideLibrary2D(
//     uiManager,
//     slideBackgroundImageSrc
// );
//
// const startRecordingButton = document.getElementById('start-recording-button');
// const stopRecordingButton = document.getElementById('stop-recording-button');
// const playbackButtonsContainer = document.getElementById('playback-buttons-container');
//
// startRecordingButton.addEventListener('click', () => {
//     const key = prompt('Введите название для этого набора команд:');
//     slideLibrary.startRecording(key);
//     startRecordingButton.disabled = true;
//     stopRecordingButton.disabled = false;
// });
//
// stopRecordingButton.addEventListener('click', () => {
//     let recordingKey = slideLibrary.stopRecording();
//     startRecordingButton.disabled = false;
//     stopRecordingButton.disabled = true;
//     slideLibrary.createPlaybackButton(recordingKey, playbackButtonsContainer);
// });

import {UIManager} from "../diploma-libs/slide-raster-graphics/modules/UIManager.js";
import {SlideLibrary} from "../diploma-libs/slide-raster-graphics/modules/SlideLibrary.js";

const slideContainer = document.getElementById('slide-container');
const toolsContainer = document.getElementById('tools-container');
const uiManager = new UIManager(slideContainer, toolsContainer);

const slideLib = new SlideLibrary(uiManager);

const startRecordingButton = document.getElementById('start-recording-button');
const stopRecordingButton = document.getElementById('stop-recording-button');
const playbackButtonsContainer = document.getElementById('playback-buttons-container');



// Создание и использование различных типов слайдов
let rasterSlide = slideLib.createSlide('raster', './img/first-image.jpg');

startRecordingButton.addEventListener('click', () => {
    const key = prompt('Введите название для этого набора команд:');
    // slideLibrary.startRecording(key);
    slideLib.startRecording(key);
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
});

stopRecordingButton.addEventListener('click', () => {
    let recordingKey = slideLib.stopRecording();
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
    slideLib.createPlaybackButton(recordingKey, playbackButtonsContainer);
    // slideLibrary.createPlaybackButton(recordingKey, playbackButtonsContainer);
});

// slideLib.startRecording('drawing1');
// rasterSlide.render(); // Пользователь рисует что-то
// slideLib.stopRecording('drawing1');
//
// let videoSlide = slideLib.createSlide('video', './video/sample.mp4');
// slideLib.startRecording('video1');
// videoSlide.render();
// slideLib.stopRecording('video1');
//
// let textSlide = slideLib.createSlide('text', 'Начальный текст');
// slideLib.startRecording('text1');
// textSlide.render();
// slideLib.stopRecording('text1');
//
// slideLib.createPlaybackButton('drawing1', document.getElementById('playback-buttons-container'));