import {SlideObject} from "../../base-slide/SlideObject.js";

export class Slide2D extends SlideObject {

    constructor(slideHtmlContainer, backgroundImage) {
        super(slideHtmlContainer);
        this.type = "2d"
        if (slideHtmlContainer.innerHTML) {
            slideHtmlContainer.innerHTML = '';
        }


        this.slideBackgroundImage = backgroundImage;
        this.createCanvas();
    }

    createCanvas() {
        this.slideCanvas = document.createElement('canvas');
        this.slideCanvas.width = this.slideWidth;
        this.slideCanvas.height = this.slideHeight;
        this.outerSlideHtmlContainer.appendChild(this.slideCanvas);

        // Получаем контекст рисования
        this.slideContext = this.slideCanvas.getContext('2d');

        // Загружаем фоновое изображение, если оно задано
        if (this.slideBackgroundImage) {
            const slideImg = new Image();
            slideImg.onload = () => {
                this.slideContext.drawImage(slideImg, 0, 0, this.slideWidth, this.slideHeight);
            };
            slideImg.src = this.slideBackgroundImage;
        }
    }

    clearCanvas() {
        if (this.slideCanvas) {
            this.slideCanvas.remove();
            this.outerSlideHtmlContainer.innerHTML = '';
        }

        this.createCanvas();
    }

}
