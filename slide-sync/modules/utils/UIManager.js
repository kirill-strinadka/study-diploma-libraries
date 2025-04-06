import {ToolManager} from "./ToolManager.js";

export class UIManager {

    constructor(slideContainer, toolsContainer) {

        if (!(slideContainer instanceof HTMLElement)) {
            throw new Error('Контейнер должен быть HTML-элементом');
        }
        // Список разрешенных тегов (блочные элементы)
        const allowedTags = ['DIV', 'SECTION', 'ARTICLE', 'MAIN', 'ASIDE', 'HEADER', 'FOOTER'];
        if (!allowedTags.includes(slideContainer.tagName)) {
            throw new Error(`Контейнер должен быть блочным элементом (разрешены: ${allowedTags.join(', ')})`);
        }

        if (!(toolsContainer instanceof HTMLElement)) {
            throw new Error('Контейнер для инструментов должен быть HTML-элементом');
        }

        // Установка размеров контейнера (опционально)
        // this.container.style.width = `${this.settings.width}px`;
        // this.container.style.height = `${this.settings.height}px`;


        this.slideContainer = slideContainer;
        this.toolsContainer = toolsContainer;
        this.toolManager = new ToolManager(toolsContainer);
    }

    getToolManager() {
        return this.toolManager;
    }

    clearUI() {
        this.getToolManager().clearTools()
        this.slideContainer.innerHTML = '';
    }

}