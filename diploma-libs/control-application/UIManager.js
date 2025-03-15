import {penColors, penWidths} from "../slide-raster-graphics/modules/penSettings.js";

export class UIManager {
    constructor(slideContainer, toolsContainer, width = 600, height = 400) {
        this.slideContainer = slideContainer;
        this.toolsContainer = toolsContainer;
        this.slideWidth = width;
        this.slideHeight = height;
        this._slideCanvas = null; // Ссылка на canvas
        this._toolsPanel = null;  // Ссылка на панель инструментов

        this.createTools()  // пока что хардкод
    }

    // Геттер для слайд-холста
    get slideCanvas() {
        if (!this._slideCanvas) {
            this._slideCanvas = this.createSlideCanvas();
        }
        return this._slideCanvas;
    }

    // Геттер для панели инструментов
    get toolsPanel() {
        if (!this._toolsPanel) {
            this._toolsPanel = this.createToolsPanelHtmlElement();
        }
        return this._toolsPanel;
    }


    // Метод для создания html-элемента для панели инструментов
    createToolsPanelHtmlElement() {
        this.toolsContainer.innerHTML = ''; // Очищаем контейнер перед созданием новой панели
        return this.toolsContainer;
    }

    get slideContext() {
        if (this._slideCanvas) {
            return this._slideCanvas.getContext('2d')
        } else {
            this.createSlideCanvas()
            return this._slideCanvas.getContext('2d')
        }
    }

    setBackGroundImage(imageSrc) {
        if (!imageSrc && this.slideBackgroundImage) {
            imageSrc = this.slideBackgroundImage;
        }
        if (imageSrc) {
            this.slideBackgroundImage = imageSrc;
            const slideImg = new Image();
            slideImg.onload = () => {
                let slideContext = this.slideContext;
                slideContext.drawImage(slideImg, 0, 0, this.slideWidth, this.slideHeight);
            };
            slideImg.src = this.slideBackgroundImage;
        }
    }

    createSlideCanvas(width, height) {
        this._slideCanvas = document.createElement('canvas');

        if (width) {
            this._slideCanvas.width = width;
        } else {
            this._slideCanvas.width = this.slideWidth;
        }

        if (height) {
            this._slideCanvas.height = height;
        } else {
            this._slideCanvas.height = this.slideHeight;
        }

        this.slideContainer.appendChild(this._slideCanvas);
        return this._slideCanvas;
    }

    clearCanvas() {
        if (this._slideCanvas) {
            this._slideCanvas.remove();
            this.slideContainer.innerHTML = '';
        }

        this.createSlideCanvas();
        if (this.slideBackgroundImage) {
            this.setBackGroundImage();
        }
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
            let button = this.toolsContainer.querySelector(`button[data-width="${width}"]`);

            if (!button) {
                // Если кнопка не существует, создаем новую
                button = document.createElement('button');
                button.textContent = label;
                button.setAttribute('title', title);
                button.setAttribute('data-width', width); // Добавляем уникальный атрибут для проверки
                this.toolsContainer.appendChild(button);
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
            let button = this.toolsContainer.querySelector(`button[data-color="${color}"]`);

            if (!button) {
                // Если кнопка не существует, создаем новую
                button = document.createElement('button');
                button.textContent = label;
                button.setAttribute('title', title);
                button.setAttribute('data-color', color); // Добавляем уникальный атрибут для проверки
                this.toolsContainer.appendChild(button);
            }

            // Привязываем обработчик события к текущему экземпляру
            button.onclick = () => {
                this.penColor = color;
            };
        });
    }
}