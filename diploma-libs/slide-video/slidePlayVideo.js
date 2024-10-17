import { executeCommandToVideo } from './videoCommands.js';

export class SlidePlayVideo {
    constructor(videoElement, SRC, Controls) {
        this.slideBlock = videoElement;
        this.cmdArr = Controls;

        // Создаем элемент видео
        this.slideVideoElement = this.createVideoElement(SRC);
        this.slideBlock.appendChild(this.slideVideoElement);

        this.execCMD = this.execCMD.bind(this);

        this.iCMD = 0;
        this.lastCMD = this.cmdArr.length - 1;

        this.stop = this.stop.bind(this);
        this.restart = this.restart.bind(this);
        this.nextCMD = this.nextCMD.bind(this);
    }

    createVideoElement(src) {
        const video = document.createElement('video');
        video.src = src;
        video.style.width = '100%';
        video.style.height = '100%';
        return video;
    }

    start() { // Начать воспроизведение команд
        console.log(this.cmdArr.length);
        if (this.iCMD < this.lastCMD) {
            let cmd0 = this.cmdArr[this.iCMD];
            this.interval = cmd0[0];
            this.startTime = (new Date()).getTime();
            this.setTimeID = setTimeout(this.nextCMD, this.interval);
        }
    }

    nextCMD() { // Выполнение следующей команды
        console.log(this.iCMD);
        let cmd0 = this.cmdArr[this.iCMD];
        this.execCMD(cmd0);
        this.iCMD++;
        if (this.iCMD < this.lastCMD) {
            let t0 = cmd0[0];
            let cmd1 = this.cmdArr[this.iCMD];
            let t1 = cmd1[0];
            this.interval = t1 - t0;
            this.startTime = (new Date()).getTime();
            this.setTimeID = setTimeout(this.nextCMD, this.interval);
        }
    }

    stop() { // Остановить воспроизведение
        clearTimeout(this.setTimeID);
        this.stopTime = (new Date()).getTime();
        if (this.slideVideoElement.paused == false) {
            this.slideVideoElement.pause();
            this.pauseFLG = false;
        } else {
            this.pauseFLG = true;
        }
    }

    restart() { // Перезапустить воспроизведение
        let stopInterval = this.interval;
        this.interval = stopInterval - (this.stopTime - this.startTime);
        this.startTime = (new Date()).getTime();
        this.setTimeID = setTimeout(this.nextCMD, this.interval);
        if (this.pauseFLG == false) { this.slideVideoElement.play(); }
        console.log(this.pauseFLG + '**' + this.slideVideoElement.paused);
    }

    execCMD(cmd) { // Выполнение команды
        executeCommandToVideo(this.slideVideoElement, cmd[1]);
    }
}
