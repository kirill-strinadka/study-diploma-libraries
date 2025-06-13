// ─────────────────────────── PlaybackSlide.js ──────────────────────────────────

import {SlideDTO} from "../utils/SlideDTO.js";
import {UIManager} from "../utils/UIManager.js";

const allowedTags = ['DIV', 'SECTION', 'ARTICLE', 'MAIN', 'ASIDE', 'HEADER', 'FOOTER'];

export class PlaybackSlide {
    constructor(container, commands = [], content) {
        this.commands = commands; // Массив команд для воспроизведения

        if (!(container instanceof HTMLElement)) {
            throw new Error('Контейнер должен быть HTML-элементом');
        }
        if (!allowedTags.includes(container.tagName)) {
            throw new Error(`Контейнер должен быть блочным элементом (разрешены: ${allowedTags.join(', ')})`);
        }

        this.container = container;
        this.type = 'abstract'; // Будет переопределен в подклассах

        this.uiManager = new UIManager(container, null);
        this.uiManager.clearUI()

        this.currentTimeout = null;
        this.recording = false;
        this.startTime = null;

        // Состояние воспроизведения. Используется для play/pause/resume
        this.isPlaying = false;
        this.currentCommandIndex = 0;
        this.elapsedTime = 0; // Время, прошедшее с начала текущей команды
    }

    clearContainer() {
        this.container.innerHTML = '';
    }

    play() {

        if (this.isPlaying || this.currentCommandIndex >= this.commands.length)
            return; // Ничего не делаем, если уже воспроизводится или команды закончились

        this.isPlaying = true;

        // Восстанавливаем состояние, выполняя все предыдущие команды
        this._toInitState(); // Сбрасываем в начальное состояние
        for (let i = 0; i < this.currentCommandIndex; i++) {
            this._executeCommand(this.commands[i]); // Выполняем команды до текущей без задержек
        }

        if (this.currentCommandIndex === 0) {
            this._toInitState(); // Сбрасываем состояние, если начинаем с начала
        }

        if (this.commands.length === 0) {
            this.isPlaying = false;
            return; // Если команд нет, выходим
        }

        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout); // Очищаем предыдущий таймер
        }

        if (this.commands.length === 0) return; // Если команд нет, ничего не делаем

        const playNext = () => {
            if (!this.isPlaying) return; // Прерываем, если на паузе

            if (this.currentCommandIndex < this.commands.length) {
                const cmd = this.commands[this.currentCommandIndex];
                this._executeCommand(cmd);
                this.currentCommandIndex++;

                if (this.currentCommandIndex < this.commands.length) {
                    // Вычисляем задержку до следующей команды
                    const currentTime = cmd[0];
                    const nextTime = this.commands[this.currentCommandIndex][0];
                    const delay = nextTime - currentTime /*- this.elapsedTime*/;
                    this.elapsedTime = 0; // Сбрасываем для следующей команды
                    this.currentTimeout = setTimeout(playNext, delay);
                } else {
                    this.isPlaying = false; // Воспроизведение завершено
                }
            }
        };

        // Первая задержка — это время от начала записи до первой команды
        // Если это начало или возобновление, учитываем elapsedTime
        const initialDelay = this.currentCommandIndex === 0 ? this.commands[0][0] : 0;
        this.currentTimeout = setTimeout(playNext, initialDelay);
    }

    pause() {
        if (!this.isPlaying) return; // Если не воспроизводится, ничего не делаем

        this.isPlaying = false;
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;

            // Сохраняем время, прошедшее с последней команды
            const lastCommandTime = this.commands[this.currentCommandIndex - 1][0];
            const nextCommandTime = this.commands[this.currentCommandIndex][0];
            this.elapsedTime = Date.now() - lastCommandTime; // Примерное время
        }
    }

    stop() {
        this.pause();
        this.currentCommandIndex = 0;
        this.elapsedTime = 0;
        this._toInitState();
    }

    getCommands() {
        return this.commands;
    }

    getType() {
        return this.type;
    }

    getSlideDTO() {
        return new SlideDTO(this.commands, this.getContent(), this.type);
    }

    onResize(newWidth, newHeight) {
        throw new Error('onResize(newWidth, newHeight) должен быть реализован в подклассе');
    }

    _executeCommand(command) {
        throw new Error('_executeCommand() должен быть реализован в подклассе');
    }

    _toInitState() {
        throw new Error('_toInitState() должен быть реализован в подклассе');
    }

    render() {
        throw new Error('render() должен быть реализован в подклассе');
    }

    getContent() {
        throw new Error('getContent() должен быть реализован в подклассе');
    }

    // Метод для получения аргументов создания, который должен быть переопределен
    getCreationArgs() {
        throw new Error('Метод getCreationArgs должен быть реализован в наследнике');
    }

}
