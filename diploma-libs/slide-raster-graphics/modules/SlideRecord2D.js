import {norm} from './utils.js';
import { executeCommandToGraphicSlide } from './graphicsCommands.js';

export class SlideRecord2D  {

    constructor(toolsElement, slide2D, uiManager) {
        this.slide = slide2D;

        this.uiManager = uiManager;
        this.slideBlock = uiManager.slideContainer;
        this.slideContext = uiManager.slideContext;

        this.canvas = uiManager.slideCanvas;

        this.width1 = this.slideBlock.clientWidth;
        this.height1 = this.slideBlock.clientHeight;
    }

    start = () => {
        let date = new Date();
        this.startTime = date.getTime();
        this.uiManager.penColor = 'red';
        this.uiManager.penWidth = '3';
        this.canvas.addEventListener('mousedown', this.onMouseDown); // включаем реагирование на рисование заметок
    }

    onMouseDown = (event) => {
        //	let t1 = (new Date()).getTime;
        let XY = [event.offsetX, event.offsetY]; // записываем в объект начальное время и координаты старта
        this.prepareCMD('beginPath');
        this.prepareCMD('setPenColor', this.uiManager.penColor);
        this.prepareCMD('setPenWidth', this.uiManager.penWidth);
        this.prepareCMD('moveTo', norm(XY, this.width1, this.height1));
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseMove = (event) => {
        let XY = [event.offsetX, event.offsetY];
        this.prepareCMD('lineTo', norm(XY, this.width1, this.height1));
    }

    onMouseUp = () => {
        this.prepareCMD('closePath');
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
    }

    prepareCMD = (action, options) => {
        let command = [];
        let date = new Date();
        let t1 = date.getTime();
        command[0] = t1 - this.startTime;
        command[1] = action;
        command[2] = options;
        this.slide.cmdArr.push(command);

        // Чтобы сразу отрисовалось при записи команд
        this.execCMD(command);
    }

    execCMD = (command) => {
        executeCommandToGraphicSlide(
            this.slideContext,
            command,
            this.width1,
            this.height1
        )
    }

    finish() {
        this.prepareCMD('closePath');
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.uiManager.clearCanvas()
    }

    getControls() {
        return this.slide.cmdArr;
    }

    getRecordedSlide() {
        return this.slide;
    }

}
