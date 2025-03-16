import {Slide} from "../../base-slide/Slide.js";
import {denorm, norm} from "./utils.js";

// Массив настроек толщины линий ручки
export const penWidths = [
    { label: '❘', width: 3, title: 'thin pen' },
    { label: '❙', width: 5, title: 'medium pen' },
    { label: '❚', width: 7, title: 'thick pen' }
];

// Массив настроек цветов ручки
export const penColors = [
    { label: '🟥', color: 'red', title: 'red color' },
    { label: '🟩', color: 'green', title: 'green color' },
    { label: '🟦', color: 'blue', title: 'blue color' }
];

export class RasterGraphicsSlide extends Slide {
    constructor(container, uiManager, backgroundImage) {
        super(container, { width: 600, height: 400 });
        this.type = 'raster';
        this.backgroundImage = backgroundImage;

        this.uiManager = uiManager;
        this.toolManager = uiManager.getToolManager();
        this.startTime = null;
        this.penColor = 'black';
        this.penWidth = 1;

        this._recreateCanvas()
        this.createTools(this.toolManager);
    }

    createTools(toolManager) {
        const toolsConfig = [
            ...penColors.map(({ label, color, title }) => ({
                label,
                title,
                action: () => (this.penColor = color),
            })),
            ...penWidths.map(({ label, width, title }) => ({
                label,
                title,
                action: () => (this.penWidth = width),
            })),
        ];
        toolManager.registerTools(toolsConfig);
    }

    _recreateCanvas() {
        this.clearCanvas()
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
        this.uiManager.penColor = 'red';
        this.uiManager.penWidth = '3';

        this._recreateCanvas()
        this.canvas.addEventListener('mousedown', this._onMouseDown);

        // this.prepareCMD('closePath');
        // this.canvas.removeEventListener('mousemove', this._onMouseMove);
        // this.canvas.removeEventListener('mousedown', this._onMouseDown);
        // this.clearCanvas()
    }

    stopRecording() {
        this.recording = false;
        this.canvas.removeEventListener('mousedown', this._onMouseDown);
        return this;
    }

    play22() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout); // Очищаем предыдущий таймер
        }
        this._recreateCanvas();
        // this.render(); // Отрисовываем начальное состояние

        let i = 0;
        const playNext = () => {
            if (i < this.commands.length) {
                this._executeCommand(this.commands[i]);
                i++;
                if (i < this.commands.length) {
                    const [currentTime] = this.commands[i - 1];
                    const [nextTime] = this.commands[i];
                    const delay = nextTime - currentTime || 0; // Избегаем отрицательных задержек
                    this.currentTimeout = setTimeout(playNext, delay);
                }
            }
        };
        playNext();
    }

    // todo - вынести в базовый класс
    play() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout); // Очищаем предыдущий таймер
        }
        this._recreateCanvas();
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
    }

    // todo - вынести в базовый класс
    playOld() {
        this._recreateCanvas()

        this._executeCommand = this._executeCommand.bind(this);
        this.iCMD = 0;
        this.lastCMD = this.commands.length-1;

        const playNext = () => {
            console.log ('Комманд в слайде', this.commands.length);
            if (this.iCMD < this.lastCMD) {
                let cmd0 = this.commands[this.iCMD];
                this.interval = cmd0[0];
                this.startTime = (new Date ()).getTime();
                this.setTimeID = setTimeout (this.nextCMD, this.interval);
            }
        };

        playNext();
    }

    nextCMD = () => {
        console.log (this.iCMD);
        let cmd0 = this.commands[this.iCMD];
        this._executeCommand(cmd0);
        this.iCMD ++;
        if (this.iCMD < this.lastCMD) {
            let t0 = cmd0[0];
            let cmd1 = this.commands[this.iCMD];
            let t1 = cmd1[0];
            this.interval = t1-t0;
            this.startTime = (new Date ()).getTime();
            this.setTimeID = setTimeout (this.nextCMD, this.interval);
        }
    }

    _onMouseDown = (event) => {
        const start = [event.offsetX, event.offsetY];


        this.prepareCMD('beginPath');
        this.prepareCMD('setPenColor', this.penColor);
        this.prepareCMD('setPenWidth', this.penWidth);
        this.prepareCMD('moveTo', norm(start, this.settings.width, this.settings.height));

        // this.commands.push(['beginPath', start]);

        this.canvas.addEventListener('mousemove', this._onMouseMove);
        this.canvas.addEventListener('mouseup', this._onMouseUp);
    };

    _onMouseMove = (event) => {
        // this.commands.push(['lineTo', [event.offsetX, event.offsetY]]);
        // this.render(); // Немедленная обратная связь

        let XY = [event.offsetX, event.offsetY];
        this.prepareCMD('lineTo', norm(XY, this.settings.width, this.settings.height));
    };

    _onMouseUp = () => {
        // this.commands.push(['closePath']);
        // this.canvas.removeEventListener('mousemove', this._onMouseMove);
        // this.canvas.removeEventListener('mouseup', this._onMouseUp);

        this.prepareCMD('closePath');
        this.canvas.removeEventListener('mousemove', this._onMouseMove);
    };

    prepareCMD = (action, options) => {
        let command = [];
        let date = new Date();
        let t1 = date.getTime();
        command[0] = t1 - this.startTime;
        command[1] = action;
        command[2] = options;
        this.commands.push(command);

        // Чтобы сразу отрисовалось при записи команд
        this._executeCommand(command);
    }

    // _executeCommand([action, args]) {
    //     switch (action) {
    //         case 'beginPath':
    //             this.context.beginPath();
    //             this.context.moveTo(...args);
    //             break;
    //         case 'lineTo':
    //             this.context.lineTo(...args);
    //             this.context.stroke();
    //             break;
    //         case 'closePath':
    //             this.context.closePath();
    //             this.context.stroke();
    //             break;
    //     }
    // }

    _executeCommand(command) {
        executeCommandToGraphicSlide(
            this.context,
            command,
            this.settings.width,
            this.settings.height
        )
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

// todo - мб можно создать объект контекста слайда, чтобы сюда его передавать и выполнять над ним действия. (мб сам SlideRecord подойдет)
export function executeCommandToGraphicSlide(slideContext, command, width1, height1) {
    let action = command[1];  // Здесь извлекаем действие (например, moveTo)
    let options = command[2]; // Здесь извлекаем опции

    // Проверка, есть ли такая команда в slideCommands
    if (slideCommands[action]) {
        // Передаем context, options и другие параметры в команду
        slideCommands[action](slideContext, options, width1, height1);
    } else {
        console.error(`Команда "${action}" не распознана`);
    }
}