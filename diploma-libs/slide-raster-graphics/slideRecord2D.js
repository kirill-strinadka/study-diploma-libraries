import {norm, denorm} from './utils.js';
import { penWidths, penColors } from './penSettings.js';
import { executeCommandToGraphicSlide } from './graphicsCommands.js';

export class SlideRecord2D {

    constructor(slideElement, toolsElement, slideSRC) {
        this.slideBlock = slideElement;
        this.toolsBlock = toolsElement;

        this.width1 = this.slideBlock.clientWidth;
        this.height1 = this.slideBlock.clientHeight;
        this.cmdArr = [];

        this.createCanvas(slideSRC);
        this.createTools();
    }

    createCanvas(slideSRC) {
        // создаем элемент 2D
        this.slideCanvas = document.createElement('canvas');
        this.slideCanvas.width = this.width1;
        this.slideCanvas.height = this.height1;
//		this.slideCanvas.style.borderStyle= 'double';
        this.slideBlock.appendChild(this.slideCanvas);
        this.slideContext = this.slideCanvas.getContext('2d');
        let slideImg = new Image();
        slideImg.onload = (function () {
            this.slideContext.drawImage(slideImg, 0, 0, this.width1, this.height1)
        }).bind(this);
        slideImg.src = slideSRC;
    }

    createTools() {
        // импортируем набор ширины ручки
        this.addPenWidthTools();
        // импортируем набор цветов для ручки
        this.addPenColorTools();
    }

    addPenWidthTools() {
        penWidths.forEach(({ label, width, title }) => {
            const button = document.createElement('button');
            button.textContent = label;
            button.setAttribute('title', title);
            this.toolsBlock.appendChild(button);
            button.onclick = () => { this.penWidth = width };
        });
    }

    addPenColorTools() {
        penColors.forEach(({ label, color, title }) => {
            const button = document.createElement('button');
            button.textContent = label;
            button.setAttribute('title', title);
            this.toolsBlock.appendChild(button);
            button.onclick = () => { this.penColor = color };
        });
    }

    start = () => {
        let date = new Date();
        this.t0 = date.getTime();
        this.penColor = 'red';
        this.penWidth = '3';
        this.slideCanvas.addEventListener('mousedown', this.onMouseDown); // включаем реагирование на рисование заметок
    }

    onMouseDown = (event) => {
        //	let t1 = (new Date()).getTime;
        let XY = [event.offsetX, event.offsetY]; // записываем в объект начальное время и координаты старта
        this.prepareCMD('beginPath');
        this.prepareCMD('setPenColor', this.penColor);
        this.prepareCMD('setPenWidth', this.penWidth);
        this.prepareCMD('moveTo', norm(XY, this.width1, this.height1));
        this.slideCanvas.addEventListener('mousemove', this.onMouseMove);
        this.slideCanvas.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseMove = (event) => {
        let XY = [event.offsetX, event.offsetY];
        this.prepareCMD('lineTo', norm(XY, this.width1, this.height1));
    }

    onMouseUp = () => {
        this.prepareCMD('closePath');
        this.slideCanvas.removeEventListener('mousemove', this.onMouseMove);
    }

    prepareCMD = (action, options) => {
        let act = action;
        let command = [];
        let date = new Date();
        let t1 = date.getTime();
        command[0] = t1 - this.t0;
        command[1] = action;
        command[2] = options;
        this.cmdArr.push(command);
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
        this.slideCanvas.removeEventListener('mousemove', this.onMouseMove);
        this.slideCanvas.removeEventListener('mousedown', this.onMouseDown);
    }

    getControls() {
        return this.cmdArr;
    }

}
