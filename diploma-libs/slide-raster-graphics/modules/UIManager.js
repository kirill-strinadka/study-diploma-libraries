export class UIManager {
    constructor(slideContainer, toolsContainer) {
        this.slideContainer = slideContainer;
        this.toolsContainer = toolsContainer;
        this._slideCanvas = null;
    }

    createCanvas(width = 600, height = 400) {
        this._slideCanvas = document.createElement('canvas');
        this._slideCanvas.width = width;
        this._slideCanvas.height = height;
        this.slideContainer.appendChild(this._slideCanvas);
        return this._slideCanvas;
    }

    clearCanvas() {
        this.slideContainer.innerHTML = '';
    }
}