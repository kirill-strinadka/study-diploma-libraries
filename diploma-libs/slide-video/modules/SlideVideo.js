import {SlideObject} from "../../base-slide/SlideObject.js";

export class SlideVideo extends SlideObject {

    constructor(videoElement, videoSrc) {
        super(videoElement);
        this.type = "video"
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
