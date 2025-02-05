import {SlideVideo} from "./SlideVideo.js";
import {SlideRecordVideo} from "./SlideRecordVideo.js";
import {SlidePlayVideo} from "./SlidePlayVideo.js";

// Инициализация для Видео
const videoElement = document.getElementById('video-container');
const toolsElementVideo = document.getElementById('video-tools-container');
const videoSrc = './video/first-video.mp4'; // Путь к видео

let slideVideo = new SlideVideo(videoElement, videoSrc);

const videoRecorder = new SlideRecordVideo(toolsElementVideo, slideVideo);
videoRecorder.start();

const startPlaybackButtonVideo = document.getElementById('start-playback-button-video');
startPlaybackButtonVideo.addEventListener('click', () => {
    videoRecorder.stopRecording();
    const recordedSlide = videoRecorder.getRecordedSlide();
    const videoPlayer = new SlidePlayVideo(recordedSlide);
    videoPlayer.start(); // Начать воспроизведение
});
