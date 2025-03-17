import {ToolManager} from "./ToolManager.js";

export class UIManager {

    constructor(slideContainer, toolsContainer) {
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