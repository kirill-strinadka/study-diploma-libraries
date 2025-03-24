import {SlideStorage} from "./utils/SlideStorage.js";

// Базовые модули по умолчанию
const defaultModules = {
    'raster': './RasterGraphicsSlide.js',
    'video': './VideoSlide.js'
};

export class SlideLibrary {
    constructor(uiManager, otherModules) {
        this.uiManager = uiManager;
        this.slideStorage = new SlideStorage();
        this.currentSlide = null;

        // Объединяем базовые модули с переданными извне
        this.slideModules = { ...defaultModules, ...otherModules };

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

    async recreateSlide() {
        const type = this.currentSlide.type; // Используется только для загрузки модуля
        const SlideClass = await this.loadSlideModule(type);
        const creationArgs = this.currentSlide.getCreationArgs(); // Получаем аргументы от текущего слайда
        return new SlideClass(this.uiManager.slideContainer, this.uiManager, ...creationArgs);
    }

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