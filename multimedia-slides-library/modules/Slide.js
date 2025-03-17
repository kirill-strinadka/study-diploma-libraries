
export class Slide {
    constructor(container, settings = {}) {
        this.container = container;
        this.type = 'abstract'; // Будет переопределен в подклассах
        this.settings = { width: 600, height: 400, ...settings };
        this.commands = []; // Массив для хранения команд для записи/воспроизведения

        this.currentTimeout = null;
        this.recording = false;
        this.startTime = null;
    }

    clearContainer() {
        this.container.innerHTML = '';
    }

    // Абстрактные методы, которые должны быть реализованы в подклассах
    createTools(toolManager) {
        throw new Error('createTools() должен быть реализован в подклассе');
    }

    render() {
        throw new Error('render() должен быть реализован в подклассе');
    }

    startRecording() {
        this.recording = true;
        this.startTime = new Date().getTime();
        this.commands = [];
        // throw new Error('startRecording() должен быть реализован в подклассе');
    }

    stopRecording() {
        this.recording = false;
        this.startTime = null;
        // throw new Error('stopRecording() должен быть реализован в подклассе');
    }

    _executeCommand(command) {
        throw new Error('_executeCommand() должен быть реализован в подклассе');
    }

    play() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout); // Очищаем предыдущий таймер
        }
        // this._recreateCanvas();
        // this.render(); // Отрисовываем начальное состояние

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
        // throw new Error('play() должен быть реализован в подклассе');
    }

    _prepareCommandAndExecute(action, options) {
        if (!this.recording || !this.startTime) {
            console.warn('Запись не активна или startTime не установлен');
            return;
        }

        const date = new Date();
        const timeInterval = date.getTime() - this.startTime;
        const command = [timeInterval, action, options];
        this.commands.push(command);

        // Вызов _executeCommand для немедленного рендеринга
        this._executeCommand(command);
    }

    getCommands() {
        return this.commands;
    }

}
