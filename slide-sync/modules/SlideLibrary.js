import {SlideStorage} from "./utils/SlideStorage.js";
import {RasterGraphicsSlide} from "./RasterGraphicsSlide.js";
import {VideoSlide} from "./VideoSlide.js";
import {TextSlide} from "./TextSlide.js";

export class SlideLibrary {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.slideStorage = new SlideStorage();
        this.currentSlide = null;
    }

    createSlide(type, ...args) {
        switch (type) {
            case 'raster':
                this.currentSlide = new RasterGraphicsSlide(this.uiManager.slideContainer, this.uiManager, ...args);
                break;
            case 'video':
                this.currentSlide = new VideoSlide(this.uiManager.slideContainer, this.uiManager, ...args);
                break;
            case 'text':
                this.currentSlide = new TextSlide(this.uiManager.slideContainer, this.uiManager, ...args);
                break;
            default:
                throw new Error('Неизвестный тип слайда');
        }
        return this.currentSlide;
    }

    recreateSlide() {
        switch (this.currentSlide.type) {
            case 'raster':
                return this.createSlide(this.currentSlide.type, this.currentSlide.backgroundImage);
            case 'video':
                return this.currentSlide = this.createSlide(this.currentSlide.type, this.currentSlide.videoSrc);
            case 'text':
                return this.currentSlide = this.createSlide(this.currentSlide.type, this.currentSlide.backgroundImage);

            default:
                throw new Error('Неизвестный тип слайда');
        }
    }

    startRecording(key) {
        if (!key) throw new Error('Ключ обязателен');
        this.key = key;
        this.currentSlide = this.recreateSlide();
        this.currentSlide.startRecording();
    }

    stopRecording() {
        const slideData = this.currentSlide.stopRecording();
        this.slideStorage.saveRecordedSlide(this.key, slideData);
        return this.key;
    }

    playRecording(key) {
        const slide = this.slideStorage.getRecordedSlide(key);
        console.log(JSON.stringify(slide.commands));
        if (slide) slide.play();
    }

    getSlideByKey(key) {
        return this.slideStorage.getRecordedSlide(key);
    }

    clearStorage() {
        this.slideStorage.clearStorage();
    }

    // todo - как будто это можно и вынести
    createPlaybackButton(key, container) {
        const button = document.createElement('button');
        button.textContent = `Воспроизвести: ${key}`;
        button.addEventListener('click', () => this.playRecording(key));
        container.appendChild(button);
    }

}