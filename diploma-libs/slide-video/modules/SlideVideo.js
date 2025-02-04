import {SlideObject} from "../../base-slide/SlideObject.js";

export class SlideVideo extends SlideObject {

    constructor(videoElement, videoSrc) {
        super(videoElement);
        this.type = "video"
        this.slideBlock = videoElement;

        // Используем уже существующий video-элемент или создаем новый
        this.slideVideoElement = this.slideBlock.querySelector("video") || this.createVideoElement();
        this.slideVideoElement.src = videoSrc; // Обновляем src
    }

    createVideoElement() {
        const video = document.createElement("video");
        video.style.width = "100%";
        video.style.height = "100%";
        this.slideBlock.appendChild(video);
        return video;
    }

}
