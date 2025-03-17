// import {SlideVideoLibrary} from '../multimedia-slides-library/slide-video';








import {SlideLibrary, UIManager} from "../multimedia-slides-library";

const slideContainer = document.getElementById('slide-container');
const videoHtmlContainer = document.getElementById('video-container');  // todo - оставить только slide-container
const toolsContainer = document.getElementById('tools-container');
const toolsHtmlContainer = document.getElementById('video-tools-container'); // todo - оставить только tools-container
const uiManager = new UIManager(slideContainer, toolsContainer);

const slideLib = new SlideLibrary(uiManager);

const videoSrc = '../video/first-video.mp4';

const startRecordingButton = document.getElementById('start-recording-button');
const stopRecordingButton = document.getElementById('stop-recording-button');
const playbackButtonsContainer = document.getElementById('playback-buttons-container');



// Создание и использование различных типов слайдов
let videoSlide = slideLib.createSlide('video', videoSrc);

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
});

// const slideVideoLibrary = new SlideVideoLibrary(
//     videoHtmlContainer,
//     toolsHtmlContainer,
//     videoSrc
// );
//
// const startRecordingButton = document.getElementById('start-recording-button');
// const stopRecordingButton = document.getElementById('stop-recording-button');
// const playbackButtonsContainer = document.getElementById('video-playback-buttons-container');
//
// startRecordingButton.addEventListener('click', () => {
//     const key = prompt('Введите название для этого набора команд:');
//     slideVideoLibrary.startRecording(key);
//     startRecordingButton.disabled = true;
//     stopRecordingButton.disabled = false;
// });
//
// stopRecordingButton.addEventListener('click', () => {
//     let recordingKey = slideVideoLibrary.stopRecording();
//     startRecordingButton.disabled = false;
//     stopRecordingButton.disabled = true;
//     slideVideoLibrary.createPlaybackButton(recordingKey, playbackButtonsContainer);
// });

// const startPlaybackButtonVideo = document.getElementById('start-playback-button-video');
// startPlaybackButtonVideo.addEventListener('click', () => {
//     videoRecorder.stopRecording();
//     const recordedSlide = videoRecorder.getRecordedSlide();
//     const videoPlayer = new SlidePlayVideo(recordedSlide);
//     videoPlayer.start(); // Начать воспроизведение
// });