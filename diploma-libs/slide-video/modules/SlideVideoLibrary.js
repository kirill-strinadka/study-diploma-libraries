import { SlideVideo } from './SlideVideo.js';
import { SlideRecordVideo } from './SlideRecordVideo.js';
import { SlidePlayVideo } from './SlidePlayVideo.js';
import { SlideStorage } from '../../base-slide/SlideStorage.js';

export class SlideVideoLibrary {
    constructor(videoContainer, toolsContainer, videoSrc) {
        this.slideStorage = new SlideStorage();
        this.videoContainer = videoContainer;
        this.slideSrc = videoSrc;
        this.slideVideo = new SlideVideo(videoContainer, videoSrc);
        this.toolsContainer = toolsContainer;
        this.slideRecorder = null;
        this.recordingKey = null;
    }

    startRecording(key) {
        if (!key) {
            alert('Название обязательно!');
            return;
        }

        this.recordingKey = key;
        this.slideRecorder = new SlideRecordVideo(this.toolsContainer, this.slideVideo);
        this.slideRecorder.start();
    }

    stopRecording() {
        if (!this.slideRecorder) return;

        this.slideRecorder.stopRecording();
        const recordedSlide = this.slideRecorder.getRecordedSlide();
        this.slideStorage.saveSlideCommands(this.recordingKey, recordedSlide);

        let recordingKey = this.recordingKey;
        this.slideRecorder = null;
        this.recordingKey = null;
        this.slideVideo = new SlideVideo(this.videoContainer, this.slideSrc);

        return recordingKey;
    }

    playRecording(key) {
        const slideVideo = this.slideStorage.getSlideCommands(key);
        if (slideVideo) {
            const slidePlayer = new SlidePlayVideo(slideVideo);
            slidePlayer.start();
        } else {
            alert(`Команды для ключа "${key}" не найдены.`);
        }
    }

    createPlaybackButton(key, container) {
        const button = document.createElement('button');
        button.textContent = `Воспроизвести: ${key}`;
        button.addEventListener('click', () => this.playRecording(key));
        container.appendChild(button);
    }
}