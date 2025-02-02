import { executeCommandToVideo } from './videoCommands.js';
import {SlideVideoBase} from './SlideVideoBase.js';

export class SlidePlayVideo extends SlideVideoBase {
    constructor(videoElement, videoSrc, Controls) {
        super(videoElement, videoSrc);

        this.cmdArr = Controls;
        this.iCMD = 0;
        this.lastCMD = this.cmdArr.length - 1;
    }

    start = () => { // Начать воспроизведение команд
        console.log(this.cmdArr.length);
        if (this.iCMD < this.lastCMD) {
            let cmd0 = this.cmdArr[this.iCMD];
            this.interval = cmd0[0];
            this.startTime = (new Date()).getTime();
            this.setTimeID = setTimeout(this.nextCMD, this.interval);
        }
    };

    // todo - есть баг с воспроизведением последней команды (последняя команда не срабатывает). Возможно в записи дело.
    nextCMD = () =>  { // Выполнение следующей команды
        console.log(this.iCMD);
        let cmd0 = this.cmdArr[this.iCMD];
        this.execCMD(cmd0);
        this.iCMD++;
        if (this.iCMD <= this.lastCMD) {
            let t0 = cmd0[0];
            let cmd1 = this.cmdArr[this.iCMD];
            let t1 = cmd1[0];
            this.interval = t1 - t0;
            this.startTime = (new Date()).getTime();
            this.setTimeID = setTimeout(this.nextCMD, this.interval);
        }
    }

    stop = () => { // Остановить воспроизведение
        clearTimeout(this.setTimeID);
        this.stopTime = (new Date()).getTime();
        if (this.slideVideoElement.paused === false) {
            this.slideVideoElement.pause();
            this.pauseFLG = false;
        } else {
            this.pauseFLG = true;
        }
    }

    restart = () =>  { // Перезапустить воспроизведение
        let stopInterval = this.interval;
        this.interval = stopInterval - (this.stopTime - this.startTime);
        this.startTime = (new Date()).getTime();
        this.setTimeID = setTimeout(this.nextCMD, this.interval);
        if (this.pauseFLG === false) { this.slideVideoElement.play(); }
        console.log(this.pauseFLG + '**' + this.slideVideoElement.paused);
    }

    execCMD = (cmd) => { // Выполнение команды
        executeCommandToVideo(this.slideVideoElement, cmd[1]);
    };

}
