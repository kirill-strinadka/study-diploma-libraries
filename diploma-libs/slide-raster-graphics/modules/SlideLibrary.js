import {SlideStorage} from "../../base-slide/SlideStorage.js";
import {RasterGraphicsSlide} from "./RasterGraphicsSlide.js";
// import {SlidePlay2D} from "./SlidePlay2D";


export class SlideLibrary {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.slideStorage = new SlideStorage();
        this.currentSlide = null;
    }

    createSlide(type, ...args) {
        switch (type) {
            case 'raster':
                this.currentSlide = new RasterGraphicsSlide(this.uiManager.slideContainer, ...args);
                break;
            // case 'video':
            //     this.currentSlide = new VideoSlide(this.uiManager.slideContainer, ...args);
            //     break;
            // case 'text':
            //     this.currentSlide = new TextSlide(this.uiManager.slideContainer, ...args);
            //     break;
            default:
                throw new Error('Неизвестный тип слайда');
        }
        return this.currentSlide;
    }

    startRecording(key) {
        if (!key) throw new Error('Ключ обязателен');
        this.key = key;
        this.currentSlide.startRecording();
    }

    stopRecording() {
        const slideData = this.currentSlide.stopRecording();
        this.slideStorage.saveSlideCommands(this.key, slideData);
        return this.key;
    }

    playRecording(key) {
        const slide = this.slideStorage.getSlideCommands(key);
        if (slide) slide.play();
        // if (slide) {
        //     const slidePlayer = new RasterGraphicsSlide(slide2D, this.uiManager);
        //     slidePlayer.start();
        // } else {
        //     alert(`Команды для ключа "${key}" не найдены.`);
        // }
    }

    // todo - как будто это можно и вынести
    createPlaybackButton(key, container) {
        const button = document.createElement('button');
        button.textContent = `Воспроизвести: ${key}`;
        button.addEventListener('click', () => this.playRecording(key));
        container.appendChild(button);
    }
}