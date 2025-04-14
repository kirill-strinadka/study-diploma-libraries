
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
    }

    clearContainer() {
        this.container.innerHTML = '';
    }

    play() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout); // Очищаем предыдущий таймер
        }

        if (this.commands.length === 0) return; // Если команд нет, ничего не делаем

        let i = 0;
        const playNext = () => {
            if (i < this.commands.length) {
                const cmd = this.commands[i];
                this._executeCommand(cmd);
                i++;
                if (i < this.commands.length) {
                    // Вычисляем задержку до следующей команды
                    const currentTime = cmd[0];
                    const nextTime = this.commands[i][0];
                    const delay = nextTime - currentTime;
                    this.currentTimeout = setTimeout(playNext, delay);
                }
            }
        };

        // Первая задержка — это время от начала записи до первой команды
        const initialDelay = this.commands[0][0];
        this.currentTimeout = setTimeout(playNext, initialDelay);
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
