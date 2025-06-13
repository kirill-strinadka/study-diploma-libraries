// ─────────────────────────── RecordingSlide.js ──────────────────────────────────

import {ToolManager} from "../utils/ToolManager.js";
import {UIManager} from "../utils/UIManager.js";
import {PlaybackSlide} from "./PlaybackSlide.js";
import {SlideDTO} from "../utils/SlideDTO.js";

const allowedTags = ['DIV', 'SECTION', 'ARTICLE', 'MAIN', 'ASIDE', 'HEADER', 'FOOTER'];

export class RecordingSlide {
    constructor(container, toolsContainer, playbackSlide, content) {

        // Команды хранятся в слайде для воспроизведения.
        // Необходимо передавать реализацию слайда воспроизведения для корректной работы
        if (!playbackSlide) {
            this.playbackSlide = new PlaybackSlide(container, []);
        } else {
            this.playbackSlide = playbackSlide;
        }

        if (!(toolsContainer instanceof HTMLElement)) {
            throw new Error('Контейнер должен быть HTML-элементом');
        }
        if (!allowedTags.includes(toolsContainer.tagName)) {
            throw new Error(`Контейнер должен быть блочным элементом (разрешены: ${allowedTags.join(', ')})`);
        }

        this.uiManager = new UIManager(container, toolsContainer);
        this.uiManager.clearUI()
        this.toolsContainer = toolsContainer;
        this.toolManager = this.uiManager.getToolManager();
        this.toolManager = new ToolManager(toolsContainer);

        this.createTools(this.toolManager);

        this.currentTimeout = null;
        this.recording = false;
        this.startTime = null;
    }

    startRecording() {
        this.recording = true;
        this.startTime = new Date().getTime();
        this._clearCommands(); // Очищаем команды перед записью
    }

    stopRecording() {
        this.recording = false;
        this.startTime = null;
        return this.getSlideDTO(); // Возвращаем записанные команды
    }

    play() {
        this.playbackSlide.play();
    }

    _prepareCommandAndExecute(action, options) {
        if (!this.recording || !this.startTime) {
            console.warn('Запись не активна или startTime не установлен');
            return;
        }

        const date = new Date();
        const timeInterval = date.getTime() - this.startTime;
        const command = [timeInterval, action, options];
        this._pushCommand(command);

        // Вызов _executeCommand для немедленного рендеринга
        this._executeCommand(command);
    }

    onResize(newWidth, newHeight) {
        this.playbackSlide.onResize(newWidth, newHeight);
    }

    _toInitState() {
        this.playbackSlide._toInitState();
    }

    _pushCommand(command) {
        this.playbackSlide.commands.push(command);
    }

    _executeCommand(command) {
        this.playbackSlide._executeCommand(command);
    }

    _getCommands() {
        return this.playbackSlide.commands;
    }

    _clearCommands() {
        this.playbackSlide.commands = [];
    }

    // Абстрактные методы, которые должны быть реализованы в подклассах
    createTools(toolManager) {
        throw new Error('createTools() должен быть реализован в подклассе');
    }

    getSlideDTO() {
        return this.playbackSlide.getSlideDTO();
    }
}
