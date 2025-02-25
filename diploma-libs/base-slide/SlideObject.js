
export class SlideObject {
    constructor(slideHtmlContainer, width = 600, height = 400, border = '1px solid black') {
        // Настройки контейнера
        this.settings = {
            width,
            height,
            border
        };
        this.type = "abstract";

        this.startOuterSlideHtmlContainer = slideHtmlContainer
        this.outerSlideHtmlContainer = slideHtmlContainer

        this.slideWidth = this.settings.width;
        this.slideHeight = this.settings.height;

        this.cmdArr = [];

        // Создаем контейнер
        // this.slideContainer = this.createSlideContainer();
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

    // Метод для возврата HTML-кода контейнера как строки
    getHTML() {
        // return this.slideContainer.outerHTML;
    }

    // Метод для добавления контейнера в DOM
    appendTo(target) {
        if (typeof target === 'string') {
            document.querySelector(target).appendChild(this.slideContainer);
        } else if (target instanceof HTMLElement) {
            target.appendChild(this.slideContainer);
        } else {
            throw new Error('Invalid target: must be a selector string or an HTMLElement.');
        }
    }

    getCommands() {
        return this.cmdArr;
    }

}
