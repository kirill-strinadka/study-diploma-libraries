import {ToolManager} from "./ToolManager.js";

export class UIManager {

    constructor(slideContainer, toolsContainer) {
        this.slideContainer = slideContainer;
        this.toolsContainer = toolsContainer;
        this._slideCanvas = null;

        this.toolManager = new ToolManager(toolsContainer);
    }

    getToolManager() {
        return this.toolManager;
    }

}