
import {PlaybackSlide} from "../base-slide/PlaybackSlide.js";

export const videoCommands = {
    play: (videoElement) => videoElement.play(),
    pause: (videoElement) => videoElement.pause(),
    onset: (videoElement) => { videoElement.currentTime = 0; },
    skipForward: (videoElement) => { videoElement.currentTime += 2.5; },
    skipBackward: (videoElement) => { videoElement.currentTime -= 2.5; },
    speedUp: (videoElement) => {videoElement.playbackRate =
        Math.min(3.0, videoElement.playbackRate + 0.2); },
    slowDown: (videoElement) => {videoElement.playbackRate =
        Math.max(0.2, videoElement.playbackRate - 0.2);}

};

export function executeCommandToVideo(videoElement, command) {
    if (videoCommands[command[1]]) {
        videoCommands[command[1]](videoElement);
    } else {
        console.error(`Команда "${command[1]}" не распознана`);
    }
}

export default class PlaybackVideoSlide extends PlaybackSlide {

    constructor(container, videoSrc, commands = [], ...restArgs) {
        super(container, commands);

        this.type = "video"

        // Используем уже существующий video-slide-элемент или создаем новый
        this.videoSrc = videoSrc
        this.slideVideoElement = this.container.querySelector("video-slide") || this.createVideoElement();
        this.slideVideoElement.src = videoSrc; // Обновляем src

        // Начальное состояние видео, чтобы потом воспроизводить команды с этого момента
        this.initialVideoState = {
            currentTime: 0,
            playbackRate: 1.0,
            paused: true
        };
    }

    _toInitState() {
        this.slideVideoElement.currentTime = this.initialVideoState.currentTime;
        this.slideVideoElement.playbackRate = this.initialVideoState.playbackRate;
        this.slideVideoElement.pause();
    }

    _saveInitialVideoState() {
        this.initialVideoState = {
            currentTime: this.slideVideoElement.currentTime,
            playbackRate: this.slideVideoElement.playbackRate,
            paused: this.slideVideoElement.paused
        };
    }

    _getVideoElement() {
        return this.slideVideoElement;
    }

    createVideoElement() {
        const video = document.createElement("video");
        video.style.width = "100%";
        video.style.height = "100%";
        this.container.appendChild(video);
        return video;
    }

    getCreationArgs() {
        return [...this.getContent()];
    }

    render() {
        // Видео рендерится автоматически в браузере
        // Можно добавить логику, если требуется начальное состояние
    }

    play() {
        this._toInitState(); // Пересоздаем видео перед воспроизведением (в начальное состояние сбрасываем)
        super.play(); // Используем общую логику воспроизведения
    }

    _executeCommand(command) {
        executeCommandToVideo(this.slideVideoElement, command)
    }

    // todo - превратить в массив или более сложный объект
    getContent() {
        return this.videoSrc; // Контент — путь к видео или само видео
    }

    getType() {
        return this.type;
    }

}

