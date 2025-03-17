
export class ToolManager {
    constructor(toolsContainer) {
        this.toolsContainer = toolsContainer;
    }

    clearTools() {
        this.toolsContainer.innerHTML = '';
    }

    createToolButton(label, title, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.setAttribute('title', title);
        button.addEventListener('click', onClick);
        this.toolsContainer.appendChild(button);
        return button;
    }

    registerTools(toolsConfig) {
        this.clearTools();
        toolsConfig.forEach(({ label, title, action }) => {
            this.createToolButton(label, title, action);
        });
    }

}
