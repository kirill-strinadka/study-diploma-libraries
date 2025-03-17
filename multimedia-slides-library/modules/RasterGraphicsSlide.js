import {Slide} from "./Slide.js";

export function norm(XY, width, height) {
    return [Math.ceil((10000 * XY[0]) / width), Math.ceil((10000 * XY[1]) / height)];
}

export function denorm(xy, width, height) {
    return [Math.ceil((xy[0] * width) / 10000), Math.ceil((xy[1] * height) / 10000)];
}

// Массив настроек толщины линий ручки
export const penWidths = [
    {label: '❘', width: 3, title: 'thin pen'},
    {label: '❙', width: 5, title: 'medium pen'},
    {label: '❚', width: 7, title: 'thick pen'}
];

// Массив настроек цветов ручки
export const penColors = [
    {label: '🟥', color: 'red', title: 'red color'},
    {label: '🟩', color: 'green', title: 'green color'},
    {label: '🟦', color: 'blue', title: 'blue color'}
];

export class RasterGraphicsSlide extends Slide {
    constructor(container, uiManager, backgroundImage) {
        super(container, uiManager, {width: 600, height: 400});
        this.type = 'raster';
        this.backgroundImage = backgroundImage;

        this.penColor = 'black';
        this.penWidth = 1;

        this._recreateCanvas()
        this.createTools(this.toolManager);
    }

    createTools(toolManager) {
        const toolsConfig = [
            ...penColors.map(({label, color, title}) => ({
                label,
                title,
                action: () => (this.penColor = color),
            })),
            ...penWidths.map(({label, width, title}) => ({
                label,
                title,
                action: () => (this.penWidth = width),
            })),
        ];
        toolManager.registerTools(toolsConfig);
    }

    _recreateCanvas() {
        this.clearContainer()
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.settings.width;
        this.canvas.height = this.settings.height;
        this.context = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this._setupBackground();
    }

    _setupBackground() {
        if (this.backgroundImage) {
            const img = new Image();
            img.onload = () => this.context.drawImage(img, 0, 0, this.settings.width, this.settings.height);
            img.src = this.backgroundImage;
        }
    }

    render() {
        // Очистка и перерисовка на основе команд
        this.context.clearRect(0, 0, this.settings.width, this.settings.height);
        this._setupBackground();
        this.commands.forEach(cmd => this._executeCommand(cmd));
    }

    startRecording() {
        this.recording = true;

        this.startTime = new Date().getTime();

        this._recreateCanvas()
        this.canvas.addEventListener('mousedown', this._onMouseDown);
    }

    stopRecording() {
        this.recording = false;
        this.canvas.removeEventListener('mousedown', this._onMouseDown);
        return this;
    }

    play() {
        this._recreateCanvas();
        super.play();
    }

    _onMouseDown = (event) => {
        const start = [event.offsetX, event.offsetY];

        this._prepareCommandAndExecute('beginPath');
        this._prepareCommandAndExecute('setPenColor', this.penColor);
        this._prepareCommandAndExecute('setPenWidth', this.penWidth);
        this._prepareCommandAndExecute('moveTo', norm(start, this.settings.width, this.settings.height));

        this.canvas.addEventListener('mousemove', this._onMouseMove);
        this.canvas.addEventListener('mouseup', this._onMouseUp);
    };

    _onMouseMove = (event) => {
        let XY = [event.offsetX, event.offsetY];
        this._prepareCommandAndExecute('lineTo', norm(XY, this.settings.width, this.settings.height));
    };

    _onMouseUp = () => {
        this._prepareCommandAndExecute('closePath');
        this.canvas.removeEventListener('mousemove', this._onMouseMove);
    };

    _executeCommand(command) {
        let action = command[1];  // Здесь извлекаем действие (например, moveTo)
        let options = command[2]; // Здесь извлекаем опции

        // Проверка, есть ли такая команда в slideCommands
        if (slideCommands[action]) {
            // Передаем context, options и другие параметры в команду
            slideCommands[action](this.context, options, this.settings.width, this.settings.height);
        } else {
            console.error(`Команда "${action}" не распознана`);
        }
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

    // Добавляй новые команды сюда
};
