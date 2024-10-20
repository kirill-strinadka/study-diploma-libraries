export class SlideBase2D {

    constructor(slideElement, slideSRC) {
        if (slideElement.innerHTML) {
            slideElement.innerHTML = '';
        }
        this.slideBlock = slideElement;
        this.width1 = this.slideBlock.clientWidth;
        this.height1 = this.slideBlock.clientHeight;
        this.createCanvas(slideSRC);
    }

    createCanvas(slideSRC) {
        this.slideCanvas = document.createElement('canvas');
        this.slideCanvas.width = this.width1;
        this.slideCanvas.height = this.height1;
        this.slideBlock.appendChild(this.slideCanvas);
        this.slideContext = this.slideCanvas.getContext('2d');
        let slideImg = new Image();
        slideImg.onload = () => {
            this.slideContext.drawImage(slideImg, 0, 0, this.width1, this.height1);
        };
        slideImg.src = slideSRC;
    }

}
