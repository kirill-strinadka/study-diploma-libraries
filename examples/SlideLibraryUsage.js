import {SlideLibrary} from "../slide-sync/index.js";
import {SlideStorage} from "./SlideStorage.js";

// Базовые модули по умолчанию
const defaultModules = {
    'raster': './RasterGraphicsSlide.js',
    'video': './VideoSlide.js'
};

export class SlideLibraryUsage {
    constructor(slideContainer, toolsContainer, otherModules) {
        this.slideLib = new SlideLibrary(slideContainer, toolsContainer, otherModules);

        // todo - вынести на уровень приложения
        this.slideStorage = new SlideStorage();
        this.currentSlide = null;
    }

    async createSlide(type, ...args) {
        return this.slideLib.createSlide(type, ...args);
    }

    async recreateSlide() {
        return this.slideLib.recreateSlide();
    }

    async startRecording(key) {
        if (!key) throw new Error('Ключ обязателен');
        this.key = key;
        this.currentSlide = await this.slideLib.recreateSlide();
        this.currentSlide.startRecording();
    }

    // todo - вынести сохранение на уровень приложения
    stopRecording() {
        const slideData = this.currentSlide.stopRecording();
        this.slideStorage.saveRecordedSlide(this.key, slideData);
        return this.key;
    }

    playRecording(key) {
        const slide = this.slideStorage.getRecordedSlide(key);
        // console.log(JSON.stringify(slide.commands));
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