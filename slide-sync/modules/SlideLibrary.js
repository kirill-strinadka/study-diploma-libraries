import {SlideStorage} from "./utils/SlideStorage.js";
// import {RasterGraphicsSlide} from "./RasterGraphicsSlide.js";
// import {VideoSlide} from "./VideoSlide.js";
// import {TextSlide} from "./TextSlide.js";

// const slideModules = {
//     'raster': './RasterGraphicsSlide.js',
//     'video': './VideoSlide.js',
//     'text': './TextSlide.js',
// };

export class SlideLibrary {
    constructor(uiManager, otherModules) {
        this.uiManager = uiManager;
        this.slideStorage = new SlideStorage();
        this.currentSlide = null;

        this.slideModules = {
            'raster': './RasterGraphicsSlide.js',
            'video': './VideoSlide.js',
            'text': './TextSlide.js',
        };

        if (otherModules) {
            this.slideModules.add(otherModules);
        }

        this.loadedModules = {}; // Кэш для загруженных модулей
    }

    // Асинхронная загрузка модуля по типу слайда
    async loadSlideModule(type) {
        if (this.loadedModules[type]) {
            return this.loadedModules[type]; // Возвращаем из кэша, если уже загружен
        }
        const modulePath = this.slideModules[type];
        if (!modulePath) {
            throw new Error('Неизвестный тип слайда');
        }
        const module = await import(modulePath);
        this.loadedModules[type] = module.default; // Сохраняем в кэш
        return module.default;
    }

    // Создание слайда с динамической подгрузкой
    async createSlide(type, ...args) {
        const SlideClass = await this.loadSlideModule(type);
        this.currentSlide = new SlideClass(this.uiManager.slideContainer, this.uiManager, ...args);
        return this.currentSlide;
    }

    // Пересоздание слайда
    async recreateSlide() {
        const type = this.currentSlide.type;
        const SlideClass = await this.loadSlideModule(type);

        // todo - проблема с условиями. В динамической подгрузке такого не должно быть
        if (type === 'raster' || type === 'text') {
            return new SlideClass(this.uiManager.slideContainer, this.uiManager, this.currentSlide.backgroundImage);
        } else if (type === 'video') {
            return new SlideClass(this.uiManager.slideContainer, this.uiManager, this.currentSlide.videoSrc);
        } else {
            throw new Error('Неизвестный тип слайда');
        }
    }

    // createSlide(type, ...args) {
    //     switch (type) {
    //         case 'raster':
    //             this.currentSlide = new RasterGraphicsSlide(this.uiManager.slideContainer, this.uiManager, ...args);
    //             break;
    //         case 'video':
    //             this.currentSlide = new VideoSlide(this.uiManager.slideContainer, this.uiManager, ...args);
    //             break;
    //         case 'text':
    //             this.currentSlide = new TextSlide(this.uiManager.slideContainer, this.uiManager, ...args);
    //             break;
    //         default:
    //             throw new Error('Неизвестный тип слайда');
    //     }
    //     return this.currentSlide;
    // }

    // recreateSlide() {
    //     switch (this.currentSlide.type) {
    //         case 'raster':
    //             return this.createSlide(this.currentSlide.type, this.currentSlide.backgroundImage);
    //         case 'video':
    //             return this.currentSlide = this.createSlide(this.currentSlide.type, this.currentSlide.videoSrc);
    //         case 'text':
    //             return this.currentSlide = this.createSlide(this.currentSlide.type, this.currentSlide.backgroundImage);
    //
    //         default:
    //             throw new Error('Неизвестный тип слайда');
    //     }
    // }

    async startRecording(key) {
        if (!key) throw new Error('Ключ обязателен');
        this.key = key;
        this.currentSlide = await this.recreateSlide();
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