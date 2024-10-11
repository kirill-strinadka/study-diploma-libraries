import {norm, denorm} from './utils.js';
import { penWidths, penColors } from './penSettings.js';

export class SlideRecord2D {

    constructor(slideElement, toolsElement, slideSRC) {
        this.slideBlock = slideElement;
        this.toolsBlock = toolsElement;

        this.width1 = this.slideBlock.clientWidth;
        this.height1 = this.slideBlock.clientHeight;
        this.cmdArr = [];

        this.createCanvas(slideSRC);
        this.createTools();
        this.bindEvents();
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

    bindEvents() {
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.prepareCMD = this.prepareCMD.bind(this);
        this.execCMD = this.execCMD.bind(this);
    }

    start() {
        let date = new Date();
        this.t0 = date.getTime();
        this.penColor = 'red';
        this.penWidth = '3';
        this.slideCanvas.addEventListener('mousedown', this.onMouseDown); // включаем реагирование на рисование заметок
    }

    onMouseDown(event) {
        //	let t1 = (new Date()).getTime;
        let XY = [event.offsetX, event.offsetY]; // записываем в объект начальное время и координаты старта
        this.prepareCMD('beginPath');
        this.prepareCMD('setPenColor', this.penColor);
        this.prepareCMD('setPenWidth', this.penWidth);
        this.prepareCMD('moveTo', norm(XY, this.width1, this.height1));
        this.slideCanvas.addEventListener('mousemove', this.onMouseMove);
        this.slideCanvas.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseMove(event) {
        let XY = [event.offsetX, event.offsetY];
        this.prepareCMD('lineTo', norm(XY, this.width1, this.height1));
    }

    onMouseUp() {
        this.prepareCMD('closePath');
        this.slideCanvas.removeEventListener('mousemove', this.onMouseMove);
    }

    prepareCMD(action, options) {
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

    execCMD(command) {
        let action = command [1];
        let options = command[2];
        let XY = new Array();
        switch (action) {
            case 'beginPath' :
                this.slideContext.beginPath();
                break;
            case 'moveTo' :
                XY = denorm(options, this.width1, this.height1);
                this.slideContext.moveTo(XY[0], XY[1]);
                break;
            case 'lineTo' :
                XY = denorm(options, this.width1, this.height1);
                this.slideContext.lineTo(XY[0], XY[1]);
                this.slideContext.stroke();
                break;
            case 'closePath' :
                this.slideContext.closePath();
                break;
            case 'setPenColor' :
                this.slideContext.strokeStyle = options;
                break;
            case 'setPenWidth' :
                this.slideContext.lineWidth = options;
                break;
        }
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
