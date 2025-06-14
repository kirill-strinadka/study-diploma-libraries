// ─────────────────────────── PlaybackRasterSlide.js ──────────────────────────────────

import {PlaybackSlide} from "../base-slide/PlaybackSlide.js";

export function norm(XY, width, height) {
    return [Math.ceil((10000 * XY[0]) / width), Math.ceil((10000 * XY[1]) / height)];
}

export function denorm(xy, width, height) {
    return [Math.ceil((xy[0] * width) / 10000), Math.ceil((xy[1] * height) / 10000)];
}

export default class PlaybackRasterSlide extends PlaybackSlide {
    constructor(container, backgroundImage, commands = [], ...restArgs) {
        super(container, commands);

        this.type = 'raster';
        this.backgroundImage = backgroundImage;

        this.penColor = 'black';
        this.penWidth = 1;
    }

    _toInitState() {
        this.clearContainer()
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.uiManager.settings.width;
        this.canvas.height = this.uiManager.settings.height;
        this.context = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this._setupBackground();
    }

    _setupBackground() {
        if (this.backgroundImage) {
            const img = new Image();
            img.onload = () => this.context.drawImage(img, 0, 0, this.uiManager.settings.width, this.uiManager.settings.height);
            img.src = this.backgroundImage;
        }
    }

    _getCanvas() {
        return this.canvas;
    }

    render() {
        // Очистка и перерисовка на основе команд
        // this.context.clearRect(0, 0, this.uiManager.settings.width, this.uiManager.settings.height);
        this._toInitState();
        // this._setupBackground();
        this.commands.forEach(cmd => this._executeCommand(cmd));
    }

    play() {
        this._toInitState();
        super.play();
    }

    _executeCommand(command) {
        let action = command[1];  // Здесь извлекаем действие (например, moveTo)
        let options = command[2]; // Здесь извлекаем опции

        // Проверка, есть ли такая команда в slideCommands
        if (slideCommands[action]) {
            // Передаем context, options и другие параметры в команду
            // todo - убрать настройки из слайда
            slideCommands[action](this.context, options, this.uiManager.settings.width, this.uiManager.settings.height);
        } else {
            console.error(`Команда "${action}" не распознана`);
        }
    }

    // todo - превратить в массив или более сложный объект
    getContent() {
        return this.backgroundImage; // Контент — путь к изображению или само изображение
    }

    onResize(newWidth, newHeight) {
        this.uiManager.settings.width = newWidth
        this.uiManager.settings.height = newHeight
        // this.canvas.width  = newWidth;
        // this.canvas.height = newHeight;
        this.render();
    }

}

export const slideCommands = {

    beginPath: (slideContext, options) => {
        slideContext.beginPath();
    },

    moveTo: (slideContext, options, width1, height1) => {
        let XY = denorm(options, width1, height1);
        slideContext.moveTo(XY[0], XY[1]);
    },

    lineTo: (slideContext, options, width1, height1) => {
        let XY = denorm(options, width1, height1);
        slideContext.lineTo(XY[0], XY[1]);
        slideContext.stroke();
    },

    closePath: (slideContext, options) => {
        slideContext.closePath();
    },

    setPenColor: (slideContext, options) => {
        slideContext.strokeStyle = options;
    },

    setPenWidth: (slideContext, options) => {
        slideContext.lineWidth = options;
    },

    // Добавлять новые команды сюда
};
