import {ToolManager} from "./ToolManager.js";

export class UIManager {

    constructor(slideContainer, toolsContainer, settings = {}) {

        if (!(slideContainer instanceof HTMLElement)) {
            throw new Error('Контейнер должен быть HTML-элементом');
        }
        // Список разрешенных тегов (блочные элементы)
        const allowedTags = ['DIV', 'SECTION', 'ARTICLE', 'MAIN', 'ASIDE', 'HEADER', 'FOOTER'];
        if (!allowedTags.includes(slideContainer.tagName)) {
            throw new Error(`Контейнер должен быть блочным элементом (разрешены: ${allowedTags.join(', ')})`);
        }

        this.slideContainer = slideContainer;

        if (toolsContainer) {
            if (!(toolsContainer instanceof HTMLElement)) {
                throw new Error('Контейнер для инструментов должен быть HTML-элементом');
            }

            this.toolsContainer = toolsContainer;
            this.toolManager = new ToolManager(toolsContainer);
        }


        // Установка размеров контейнера (опционально)
        // this.container.style.width = `${this.settings.width}px`;
        // this.container.style.height = `${this.settings.height}px`;

        this.settings = { width: 600, height: 400, ...settings };
    }

    getToolManager() {
        return this.toolManager;
    }

    clearUI() {
        if (this.toolsContainer) {
            this.getToolManager().clearTools()
        }
        this.slideContainer.innerHTML = '';
    }

}