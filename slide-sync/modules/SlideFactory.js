// SlideLibrary.js


// Базовые модули по умолчанию
import {SlideDTO} from "./utils/SlideDTO.js";

const defaultModules = {
    recording: {
        raster: './raster-slide/RecordingRasterSlide.js',
        video: './video-slide/RecordingVideoSlide.js',
        // text:   './text-slide/RecordingTextSlide.js',
    },
    playback: {
        raster: './raster-slide/PlaybackRasterSlide.js',
        video: './video-slide/PlaybackVideoSlide.js',
        // text:   './text-slide/PlaybackTextSlide.js',
    }
};

const RECORDING_MODE = 'recording'
const PLAYBACK_MODE = 'playback'

export class SlideFactory {
    /**
     * @param {HTMLElement} slideContainer
     * @param {HTMLElement|null} toolsContainer      // если режим record
     * @param {{recording, playback}} otherModules
     *        где RecordModules = Record<string, string> (type→path)
     *              PlaybackModules = Record<string, string>
     */
    constructor(slideContainer, toolsContainer, otherModules) {
        this.slideContainer = slideContainer;
        this.toolsContainer = toolsContainer;

        this.modules = defaultModules
        if (otherModules && otherModules.recording && otherModules.playback) {
            this.modules = {
                recording: {...defaultModules.recording, ...(otherModules.recording || {})},
                playback: {...defaultModules.playback, ...(otherModules.playback || {})}
            };
        }

        this.cache = {recording: {}, playback: {}};
    }

    /**
     * Зарегистрировать новый модуль для режима recording|playback
     * @param {'recording'|'playback'} mode
     * @param {string} type
     * @param {string} path — путь к модулю
     */
    registerModule(mode, type, path) {
        if (!this.modules[mode]) {
            throw new Error(`Неподдерживаемый режим: ${mode}`);
        }
        // кладём в реестр
        this.modules[mode][type] = path;
        // если ранее уже кэшировали — сбрасываем
        delete this.cache[mode][type];
    }

    // Пример использования внутри приложения:
    // slideLib.registerModule('recording','text','./TextRec.js');

    /** Режим — "recording" */
    async loadRecordingSlideModule(type) {
        return this.loadSlideModule(type, RECORDING_MODE);
    }

    /** Режим — "playback" */
    async loadPlaybackSlideModule(type) {
        return this.loadSlideModule(type, PLAYBACK_MODE);
    }

    /** Режим — "recording" или "playback" */
    async loadSlideModule(type, mode) {
        const modMap = this.modules[mode];
        if (!modMap[type]) throw new Error(`Неизвестный тип ${type} для режима ${mode}`);
        if (this.cache[mode][type]) return this.cache[mode][type];

        const {default: SlideClass} = await import(modMap[type]);
        this.cache[mode][type] = SlideClass;
        return SlideClass;
    }

    async createRecordingSlide(type, ...args) {
        let slideDTO = new SlideDTO(null, args, type);
        return this.createFromSlideDto(RECORDING_MODE, slideDTO, args);
    }

    async createPlaybackSlide(slideDTO) {
        return this.createFromSlideDto(PLAYBACK_MODE, slideDTO);
    }

    /**
     * Создать экземпляр слайда
     * @param {'recording'|'playback'} mode
     * @param {SlideDTO} slideDTO
     * @param  {...any} args         // rest args для конструктора
     */
    async createFromSlideDto(mode, slideDTO, ...args) {
        const SlideClass = await this.loadSlideModule(slideDTO.type, mode);
        // различаем конструктор: если запись — передаём toolsContainer
        if (mode === RECORDING_MODE) {
            return new SlideClass(this.slideContainer, this.toolsContainer, slideDTO.content, ...args);
        } else if (mode === PLAYBACK_MODE) {
            return new SlideClass(this.slideContainer, slideDTO.content, slideDTO.commands, ...args);
        } else {
            throw new Error(`Неизвестный тип ${slideDTO.type} для режима ${mode}`);
        }
    }

    async recreateRecordingSlide(currentInstance) {
        return this.recreate(currentInstance, RECORDING_MODE);
    }

    async recreatePlaybackSlide(currentInstance) {
        return this.recreate(currentInstance, PLAYBACK_MODE);
    }

    /**
     * Пересоздать текущий слайд
     * (если у него есть метод getCreationArgs)
     */
    async recreate(currentInstance, mode) {
        const type = mode === RECORDING_MODE
            ? currentInstance.playbackSlide.getType()
            : currentInstance.getType();
        const SlideClass = await this.loadSlideModule(type, mode);
        // получаем args из самого инстанса
        const slideDTO = currentInstance.getSlideDTO();
        if (mode === RECORDING_MODE) {
            return new SlideClass(this.slideContainer, this.toolsContainer, slideDTO.content);
        } else if (mode === PLAYBACK_MODE) {
            return new SlideClass(this.slideContainer, slideDTO.content, slideDTO.commands);
        } else {
            throw new Error(`Неизвестный тип ${type} для режима ${mode}`);
        }
    }

}
