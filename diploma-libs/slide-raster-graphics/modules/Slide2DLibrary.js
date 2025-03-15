import { SlideRecord2D } from './SlideRecord2D.js';
import { SlidePlay2D } from './SlidePlay2D.js';
import { SlideStorage } from '../../base-slide/SlideStorage.js';
import { Slide2D } from './Slide2D.js';

export class Slide2DLibrary {
    constructor(uiManager, slideSrc) {
        this.slideStorage = new SlideStorage();
        this.uiManager = uiManager;
        this.slideSrc = slideSrc;
        this.slide = new Slide2D(uiManager.slideContainer, slideSrc);
        this.toolsContainer = uiManager.toolsContainer;
        this.slideRecorder = null;
        this.recordingKey = null;
    }

    startRecording(key) {
        if (!key) {
            alert('Название обязательно!');
            return;
        }

        this.recordingKey = key;
        // this.slide.clearCanvas();
        this.uiManager.clearCanvas()
        this.slideRecorder = new SlideRecord2D(this.toolsContainer, this.slide, this.uiManager);
        this.slideRecorder.start();
    }

    stopRecording() {
        if (!this.slideRecorder) return;

        this.slideRecorder.finish();
        const recordedSlide = this.slideRecorder.getRecordedSlide();
        this.slideStorage.saveSlideCommands(this.recordingKey, recordedSlide);

        let recordingKey = this.recordingKey;
        this.slideRecorder = null;
        this.recordingKey = null;
        this.slide = new Slide2D(this.uiManager.slideContainer, this.slideSrc);
        return recordingKey;
    }

    playRecording(key) {
        const slide2D = this.slideStorage.getSlideCommands(key);
        if (slide2D) {
            const slidePlayer = new SlidePlay2D(slide2D, this.uiManager);
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