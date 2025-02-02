import { SlideRecordVideo } from './slideRecordVideo.js';
import { SlidePlayVideo } from './slidePlayVideo.js';

// Инициализация для Видео
const videoElement = document.getElementById('video-container');
const toolsElementVideo = document.getElementById('video-tools-container');
const videoSrc = './video/first-video.mp4'; // Путь к видео

const videoRecorder = new SlideRecordVideo(videoElement, toolsElementVideo, videoSrc);
videoRecorder.start(); // Начать запись

const startPlaybackButtonVideo = document.getElementById('start-playback-button-video');
startPlaybackButtonVideo.addEventListener('click', () => {
    videoRecorder.stopRecording();
    const recordedCommandsVideo = videoRecorder.getControls();
    const videoPlayer = new SlidePlayVideo(videoElement, videoSrc, recordedCommandsVideo);
    videoPlayer.start(); // Начать воспроизведение
});
