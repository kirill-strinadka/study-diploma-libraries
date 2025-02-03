import { SlideRecord2D } from './slideRecord2D.js';
import { SlidePlay2D } from './slidePlay2D.js';
import { SlideStorage } from './SlideStorage.js';
import { Slide2D } from './Slide2D.js';

export class SlideLibrary {
    constructor(slideContainer, toolsContainer, slideSrc) {
        this.slideStorage = new SlideStorage();
        this.slideHtmlContainer = slideContainer;
        this.slideSrc = slideSrc;
        this.slide = new Slide2D(slideContainer, slideSrc);
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
        this.slide.clearCanvas();
        this.slideRecorder = new SlideRecord2D(this.toolsContainer, this.slide);
        this.slideRecorder.start();
    }

    stopRecording() {
        if (!this.slideRecorder) return;

        this.slideRecorder.finish();
        const recordedSlide = this.slideRecorder.getRecordedSlide();
        this.slideStorage.saveCommands(this.recordingKey, recordedSlide);

        let recordingKey = this.recordingKey;
        this.slideRecorder = null;
        this.recordingKey = null;
        this.slide = new Slide2D(this.slideHtmlContainer, this.slideSrc);
        // this.slide.cmdArr = [];
        return recordingKey;
    }

    playRecording(key) {
        const slide2D = this.slideStorage.getCommands(key);
        if (slide2D) {
            const slidePlayer = new SlidePlay2D(slide2D);
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