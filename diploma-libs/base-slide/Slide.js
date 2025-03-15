
export class Slide {
    constructor(container, settings = {}) {
        this.container = container;
        this.type = 'abstract'; // Будет переопределен в подклассах
        this.settings = { width: 600, height: 400, ...settings };
        this.commands = []; // Массив для хранения команд для записи/воспроизведения
    }

    clearCanvas() {
        this.container.innerHTML = '';
    }

    // Абстрактные методы, которые должны быть реализованы в подклассах
    render() {
        throw new Error('render() должен быть реализован в подклассе');
    }

    startRecording() {
        throw new Error('startRecording() должен быть реализован в подклассе');
    }

    stopRecording() {
        throw new Error('stopRecording() должен быть реализован в подклассе');
    }

    play() {
        throw new Error('play() должен быть реализован в подклассе');
    }

    getCommands() {
        return this.commands;
    }

}
