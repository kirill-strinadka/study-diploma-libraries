export class UIManager {
    constructor(slideContainer, toolsContainer, width = 600, height = 400) {
        this.slideContainer = slideContainer;
        this.toolsContainer = toolsContainer;
        this.slideWidth = width;
        this.slideHeight = height;
        this._slideCanvas = null; // Ссылка на canvas
        this._toolsPanel = null;  // Ссылка на панель инструментов
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
            this._toolsPanel = this.createToolsPanel();
        }
        return this._toolsPanel;
    }

    executeSlideCommandOnCanvas() {

    }

    // Метод для создания html-элемента для панели инструментов
    createToolsPanel() {
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
}