
export class Slide2D {
    constructor(backgroundImage, width = 600, height = 400, border = '1px solid black') {
        // Настройки контейнера
        this.settings = {
            width,
            height,
            border
        };

        this.slideBackgroundImage = backgroundImage;
        this.slideWidth = this.settings.width;
        this.slideHeight = this.settings.height;

        this.cmdArr = [];

        // Создаем контейнер
        this.slideContainerWithCanvas = this.createSlideContainer();
        this.createCanvas();
    }

    // Метод для создания контейнера
    createSlideContainer() {
        const container = document.createElement('div');
        container.id = `slide-container-${Math.random().toString(36)}`; // Уникальный ID
        container.style.width = `${this.settings.width}px`;
        container.style.height = `${this.settings.height}px`;
        container.style.border = this.settings.border;
        container.style.position = 'relative'; // Добавляем позиционирование, если нужно
        return container;
    }

    createCanvas() {
        this.slideCanvas = document.createElement('canvas');
        this.slideCanvas.width = this.slideWidth;
        this.slideCanvas.height = this.slideHeight;
        this.slideContainerWithCanvas.appendChild(this.slideCanvas);
        this.slideContext = this.slideCanvas.getContext('2d');

        let slideImg = new Image();
        slideImg.onload = () => {
            this.slideContext.drawImage(slideImg, 0, 0, this.slideWidth, this.slideHeight);
        };
        slideImg.src = this.slideBackgroundImage;
    }

    // Метод для возврата HTML-кода контейнера как строки
    getHTML() {
        return this.slideContainerWithCanvas.outerHTML;
    }

    // Метод для добавления контейнера в DOM
    appendTo(target) {
        if (typeof target === 'string') {
            document.querySelector(target).appendChild(this.slideContainerWithCanvas);
        } else if (target instanceof HTMLElement) {
            target.appendChild(this.slideContainerWithCanvas);
        } else {
            throw new Error('Invalid target: must be a selector string or an HTMLElement.');
        }
    }

    getCommands() {
        return this.cmdArr;
    }

    clearCanvas() {
        this.slideContainerWithCanvas = ''
        this.slideContainerWithCanvas = this.createSlideContainer();
        this.createCanvas();
    }
}
