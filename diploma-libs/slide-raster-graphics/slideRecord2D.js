import {norm, denorm} from './utils.js';
import { penWidths, penColors } from './penSettings.js';
import { executeCommandToGraphicSlide } from './graphicsCommands.js';

export class SlideRecord2D  {

    constructor(slideElement, toolsElement, slide2D) {
        this.slide = slide2D;
        this.slideBlock = slideElement;
        this.toolsBlock = toolsElement;

        this.slideContext = slide2D.slideContext;

        this.width1 = this.slideBlock.clientWidth;
        this.height1 = this.slideBlock.clientHeight;

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
        this.slide.slideCanvas.addEventListener('mousedown', this.onMouseDown); // включаем реагирование на рисование заметок
    }

    onMouseDown = (event) => {
        //	let t1 = (new Date()).getTime;
        let XY = [event.offsetX, event.offsetY]; // записываем в объект начальное время и координаты старта
        this.prepareCMD('beginPath');
        this.prepareCMD('setPenColor', this.penColor);
        this.prepareCMD('setPenWidth', this.penWidth);
        this.prepareCMD('moveTo', norm(XY, this.width1, this.height1));
        this.slide.slideCanvas.addEventListener('mousemove', this.onMouseMove);
        this.slide.slideCanvas.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseMove = (event) => {
        let XY = [event.offsetX, event.offsetY];
        this.prepareCMD('lineTo', norm(XY, this.width1, this.height1));
    }

    onMouseUp = () => {
        this.prepareCMD('closePath');
        this.slide.slideCanvas.removeEventListener('mousemove', this.onMouseMove);
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
        this.slide.slideCanvas.removeEventListener('mousemove', this.onMouseMove);
        this.slide.slideCanvas.removeEventListener('mousedown', this.onMouseDown);
        this.slide.clearCanvas()
    }

    getControls() {
        return this.slide.cmdArr;
    }

    getRecordedSlide() {
        return this.slide;
    }

}
