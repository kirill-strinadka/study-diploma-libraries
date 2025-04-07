
// Список разрешенных тегов (блочные элементы)
const allowedTags = ['DIV', 'SECTION', 'ARTICLE', 'MAIN', 'ASIDE', 'HEADER', 'FOOTER'];

export class Slide {
    constructor(container, uiManager, settings = {}) {

        if (!(container instanceof HTMLElement)) {
            throw new Error('Контейнер должен быть HTML-элементом');
        }
        if (!allowedTags.includes(container.tagName)) {
            throw new Error(`Контейнер должен быть блочным элементом (разрешены: ${allowedTags.join(', ')})`);
        }


        uiManager.clearUI()
        this.container = container;
        this.type = 'abstract'; // Будет переопределен в подклассах
        this.settings = { width: 600, height: 400, ...settings };
        this.commands = []; // Массив для хранения команд для записи/воспроизведения

        this.uiManager = uiManager;
        this.toolManager = uiManager.getToolManager();

        this.currentTimeout = null;
        this.recording = false;
        this.startTime = null;
    }

    // Метод для получения аргументов создания, который должен быть переопределен
    getCreationArgs() {
        throw new Error('Метод getCreationArgs должен быть реализован в наследнике');
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
    }

    stopRecording() {
        this.recording = false;
        this.startTime = null;
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

    _executeCommand(command) {
        throw new Error('_executeCommand() должен быть реализован в подклассе');
    }

    getCommands() {
        return this.commands;
    }

    getContent() {
        throw new Error('getContent() должен быть реализован в подклассе');
    }
}
