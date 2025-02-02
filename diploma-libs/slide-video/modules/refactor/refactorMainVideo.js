import {SlideVideo} from "./SlideVideo.js";
import {SlideRecordVideoRefactor} from "./SlideRecordVideoRefactor.js";
import {SlidePlayVideoRefactor} from "./slidePlayVideoRefactor.js";

// Инициализация для Видео
const videoElement = document.getElementById('video-container');
const toolsElementVideo = document.getElementById('video-tools-container');
const videoSrc = './video/first-video.mp4'; // Путь к видео


let slideVideo = new SlideVideo(videoElement, videoSrc);


const videoRecorder = new SlideRecordVideoRefactor(toolsElementVideo, slideVideo);
videoRecorder.start();


const startPlaybackButtonVideo = document.getElementById('start-playback-button-video');
startPlaybackButtonVideo.addEventListener('click', () => {
    videoRecorder.stopRecording();
    const recordedSlide = videoRecorder.getRecordedSlide();
    const videoPlayer = new SlidePlayVideoRefactor(recordedSlide);
    videoPlayer.start(); // Начать воспроизведение
});
