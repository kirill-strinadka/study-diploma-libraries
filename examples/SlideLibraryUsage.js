import {RecordingSlideLibrary} from "../slide-sync/index.js";
import {SlideStorage} from "./SlideStorage.js";
import {PlaybackSlideLibrary} from "../slide-sync/modules/PlaybackSlideLibrary.js";

const recordingOtherModules = {
    'text': '../modules/text-slide/RecordingTextSlide.js'
}

const playbackOtherModules = {
    'text': '../modules/text-slide/PlaybackTextSlide.js'
}

const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const stopButton = document.getElementById('stop-button');

export class SlideLibraryUsage {
    constructor(slideContainer, toolsContainer) {
        this.recordingSlideLib = new RecordingSlideLibrary(slideContainer, toolsContainer, recordingOtherModules);
        this.playbackSlideLib = new PlaybackSlideLibrary(slideContainer, playbackOtherModules);

        // todo - вынести на уровень приложения
        this.slideStorage = new SlideStorage();
        this.currentRecordingSlide = null;
        this.currentPlaybackSlide = null; // Для хранения текущего воспроизводимого слайда
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
        this.currentRecordingSlide = await this.recordingSlideLib.recreateSlide();
        this.currentRecordingSlide.startRecording();
    }

    // todo - вынести сохранение на уровень приложения
    stopRecording() {
        const slideDTO = this.currentRecordingSlide.stopRecording();
        this.slideStorage.saveRecordedSlide(this.key, slideDTO);
        return this.key;
    }

    async playRecordingOld(key) {
        const slideDTO = this.slideStorage.getRecordedSlide(key);

        let slide = await this.playbackSlideLib.createSlide(
            slideDTO.type, slideDTO.content, slideDTO.commands
        );
        // создать слайд по типу и запустить его проигрывание

        // console.log(JSON.stringify(base-slide.commands));
        if (slide) slide.play();
    }

    async playRecording(key) {
        const slideDTO = this.slideStorage.getRecordedSlide(key);
        if (!slideDTO) throw new Error(`Слайд с ключом ${key} не найден`);

        // Создаём слайд для воспроизведения
        this.currentPlaybackSlide = await this.playbackSlideLib.createSlide(
            slideDTO.type, slideDTO.content, slideDTO.commands
        );

        // Создаём кнопки Play, Pause, Stop
        // Функция для обновления состояния кнопок
        const updateButtonStates = () => {
            if (!this.currentPlaybackSlide) {
                playButton.disabled = true;
                pauseButton.disabled = true;
                stopButton.disabled = true;
                return;
            }
            playButton.disabled = this.currentPlaybackSlide.isPlaying ||
                this.currentPlaybackSlide.currentCommandIndex >= this.currentPlaybackSlide.commands.length;
            pauseButton.disabled = !this.currentPlaybackSlide.isPlaying;
            stopButton.disabled = !this.currentPlaybackSlide.isPlaying &&
                this.currentPlaybackSlide.currentCommandIndex === 0;
        };

        // Привязываем обработчики событий
        playButton.addEventListener('click', () => {
            if (this.currentPlaybackSlide) {
                this.currentPlaybackSlide.play();
                updateButtonStates();
            }
        });

        pauseButton.addEventListener('click', () => {
            if (this.currentPlaybackSlide) {
                this.currentPlaybackSlide.pause();
                updateButtonStates();
            }
        });

        stopButton.addEventListener('click', () => {
            if (this.currentPlaybackSlide) {
                this.currentPlaybackSlide.stop();
                updateButtonStates();
            }
        });

        // Запускаем воспроизведение
        if (this.currentPlaybackSlide) {
            this.currentPlaybackSlide.play();
            updateButtonStates();
        }
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