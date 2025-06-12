// ─────────────────────────── RecordingSlideLibrary.js ──────────────────────────────────

// Базовые модули по умолчанию
const defaultModules = {
    'raster': './raster-slide/RecordingRasterSlide.js',
    'video': './video-slide/RecordingVideoSlide.js'
};

export class RecordingSlideLibrary {
    constructor(slideContainer, toolsContainer, otherModules) {
        this.slideContainer = slideContainer;
        this.toolsContainer = toolsContainer;

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
        this.currentSlide = new SlideClass(this.slideContainer, this.toolsContainer, ...args);
        return this.currentSlide;
    }

    async recreateSlide() {
        const type = this.currentSlide.playbackSlide.getType(); // Используется только для загрузки модуля
        const SlideClass = await this.loadSlideModule(type);
        const creationArgs = this.currentSlide.getCreationArgs(); // Получаем аргументы от текущего слайда
        return new SlideClass(this.slideContainer, this.toolsContainer, ...creationArgs);
    }

}