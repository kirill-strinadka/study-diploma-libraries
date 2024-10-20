export class SlideVideoBase {

    constructor(videoElement, videoSrc) {
        this.slideBlock = videoElement;
        this.createVideoElement(videoSrc);
    }

    createVideoElement(src) {
        this.slideVideoElement = document.createElement('video');
        this.slideVideoElement.src = src;
        this.slideVideoElement.style.width = '100%';
        this.slideVideoElement.style.height = '100%';
        this.slideBlock.appendChild(this.slideVideoElement);
        return this.slideVideoElement;
    }

}
