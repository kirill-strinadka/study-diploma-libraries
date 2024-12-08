export class SlideBase2D {

    constructor(slideElement, slide2D) {
        if (slideElement.innerHTML) {
            slideElement.innerHTML = '';
        }
        this.slideBlock = slideElement;
        this.createCanvas(slide2D);
    }

    createCanvas(slide2D) {
        this.slideCanvas = slide2D.slideCanvas;
        this.slideBlock.appendChild(this.slideCanvas);
        this.slideContext = this.slideCanvas.getContext('2d');
    }

}
