import {RecordingSlideLibrary} from "../slide-sync/index.js";
import {SlideStorage} from "./SlideStorage.js";
import {PlaybackSlideLibrary} from "../slide-sync/modules/PlaybackSlideLibrary.js";

const recordingOtherModules = {
    'text': '../modules/text-slide/RecordingTextSlide.js'
}

const playbackOtherModules = {
    'text': '../modules/text-slide/PlaybackTextSlide.js'
}

export class SlideLibraryUsage {
    constructor(slideContainer, toolsContainer) {
        this.recordingSlideLib = new RecordingSlideLibrary(slideContainer, toolsContainer, recordingOtherModules);
        this.playbackSlideLib = new PlaybackSlideLibrary(slideContainer, playbackOtherModules);

        // todo - вынести на уровень приложения
        this.slideStorage = new SlideStorage();
        this.currentSlide = null;
    }

    async createSlide(type, ...args) {
        return this.recordingSlideLib.createSlide(type, ...args);
    }

    async recreateSlide() {
        return this.recordingSlideLib.recreateSlide();
    }

    async startRecording(key) {
        if (!key) throw new Error('Ключ обязателен');
        this.key = key;
        this.currentSlide = await this.recordingSlideLib.recreateSlide();
        this.currentSlide.startRecording();
    }

    // todo - вынести сохранение на уровень приложения
    stopRecording() {
        const slideDTO = this.currentSlide.stopRecording();
        this.slideStorage.saveRecordedSlide(this.key, slideDTO);
        return this.key;
    }

    async playRecording(key) {
        const slideDTO = this.slideStorage.getRecordedSlide(key);

        let slide = await this.playbackSlideLib.createSlide(
            slideDTO.type, slideDTO.content, slideDTO.commands
        );
        // создать слайд по типу и запустить его проигрывание

        // console.log(JSON.stringify(base-slide.commands));
        if (slide) slide.play();
    }

    getSlideByKey(key) {
        return this.slideStorage.getRecordedSlide(key);
    }

    // todo - вынести на уровень приложения
    clearStorage() {
        this.slideStorage.clearStorage();
    }

    // todo - вынести на уровень приложения
    createPlaybackButton(key, container) {
        const button = document.createElement('button');
        button.textContent = `Воспроизвести: ${key}`;
        button.addEventListener('click', () => this.playRecording(key));
        container.appendChild(button);
    }

}