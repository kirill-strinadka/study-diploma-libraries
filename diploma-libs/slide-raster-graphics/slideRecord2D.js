import {norm, denorm} from './utils.js';
import { penWidths, penColors } from './penSettings.js';
import { executeCommandToGraphicSlide } from './graphicsCommands.js';
import { SlideBase2D } from './SlideBase2D.js';

export class SlideRecord2D extends SlideBase2D {

    constructor(slideElement, toolsElement, slide2D) {
        super(slideElement, slide2D);
        this.slideBlock = slideElement;
        this.toolsBlock = toolsElement;

        this.width1 = this.slideBlock.clientWidth;
        this.height1 = this.slideBlock.clientHeight;
        this.cmdArr = [];

        this.createTools();
    }

    createTools() {
        // импортируем набор ширины ручки
        this.addPenWidthTools();
        // импортируем набор цветов для ручки
        this.addPenColorTools();
    }

    addPenWidthTools() {
        penWidths.forEach(({ label, width, title }) => {
            // Проверяем, есть ли уже кнопка с таким значением ширины
            let button = this.toolsBlock.querySelector(`button[data-width="${width}"]`);

            if (!button) {
                // Если кнопка не существует, создаем новую
                button = document.createElement('button');
                button.textContent = label;
                button.setAttribute('title', title);
                button.setAttribute('data-width', width); // Добавляем уникальный атрибут для проверки
                this.toolsBlock.appendChild(button);
            }

            // Привязываем обработчик события к текущему экземпляру
            button.onclick = () => {
                this.penWidth = width;
            };
        });
    }

    addPenColorTools() {
        penColors.forEach(({ label, color, title }) => {
            // Проверяем, есть ли уже кнопка с таким значением цвета
            let button = this.toolsBlock.querySelector(`button[data-color="${color}"]`);

            if (!button) {
                // Если кнопка не существует, создаем новую
                button = document.createElement('button');
                button.textContent = label;
                button.setAttribute('title', title);
                button.setAttribute('data-color', color); // Добавляем уникальный атрибут для проверки
                this.toolsBlock.appendChild(button);
            }

            // Привязываем обработчик события к текущему экземпляру
            button.onclick = () => {
                this.penColor = color;
            };
        });
    }

    start = () => {
        let date = new Date();
        this.startTime = date.getTime();
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
        let command = [];
        let date = new Date();
        let t1 = date.getTime();
        command[0] = t1 - this.startTime;
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
