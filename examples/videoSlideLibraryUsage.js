import {SlideVideoLibrary} from '../diploma-libs/slide-video';

const videoHtmlContainer = document.getElementById('video-container');
const toolsHtmlContainer = document.getElementById('video-tools-container');
const videoSrc = '../video/first-video.mp4';

const slideVideoLibrary = new SlideVideoLibrary(
    videoHtmlContainer,
    toolsHtmlContainer,
    videoSrc
);

const startRecordingButton = document.getElementById('start-recording-button');
const stopRecordingButton = document.getElementById('stop-recording-button');
const playbackButtonsContainer = document.getElementById('video-playback-buttons-container');

startRecordingButton.addEventListener('click', () => {
    const key = prompt('Введите название для этого набора команд:');
    slideVideoLibrary.startRecording(key);
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
});

stopRecordingButton.addEventListener('click', () => {
    let recordingKey = slideVideoLibrary.stopRecording();
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
    slideVideoLibrary.createPlaybackButton(recordingKey, playbackButtonsContainer);
});

// const startPlaybackButtonVideo = document.getElementById('start-playback-button-video');
// startPlaybackButtonVideo.addEventListener('click', () => {
//     videoRecorder.stopRecording();
//     const recordedSlide = videoRecorder.getRecordedSlide();
//     const videoPlayer = new SlidePlayVideo(recordedSlide);
//     videoPlayer.start(); // Начать воспроизведение
// });