import {executeCommandToGraphicSlide} from './graphicsCommands.js';
import {SlideBase2D} from './SlideBase2D.js';

export class SlidePlay2D extends SlideBase2D {
    constructor(slideElement, slideSRC, Controls) {
        super(slideElement, slideSRC);

        this.slideBlock = slideElement;
        this.width1 = this.slideBlock.clientWidth;
        this.height1 = this.slideBlock.clientHeight;
        this.cmdArr = Controls;

        this.execCMD = this.execCMD.bind(this);
        this.iCMD = 0;
        this.lastCMD = this.cmdArr.length-1;
    }

    start = () => {
        console.log (this.cmdArr.length);
        if (this.iCMD < this.lastCMD) {
            let cmd0 = this.cmdArr[this.iCMD];
            this.interval = cmd0[0];
            this.startTime = (new Date ()).getTime();
            this.setTimeID = setTimeout (this.nextCMD, this.interval);
        }
    }

    nextCMD = () => {
        console.log (this.iCMD);
        let cmd0 = this.cmdArr[this.iCMD];
        this.execCMD (cmd0);
        this.iCMD ++;
        if (this.iCMD < this.lastCMD) {
            let t0 = cmd0[0];
            let cmd1 = this.cmdArr[this.iCMD];
            let t1 = cmd1[0];
            this.interval = t1-t0;
            this.startTime = (new Date ()).getTime();
            this.setTimeID = setTimeout (this.nextCMD, this.interval);
        }
    }

    execCMD = (command) => {
        executeCommandToGraphicSlide(
            this.slideContext,
            command,
            this.width1,
            this.height1
        )
    }

    stop = () => {
        clearTimeout (this.setTimeID);
        this.stopTime = (new Date ()).getTime();
    }

    restart = () => {
        let stopInterval = this.interval;
        this.interval = stopInterval - (this.stopTime - this.startTime);
        this.startTime = (new Date ()).getTime();
        this.setTimeID = setTimeout(this.nextCMD, this.interval);
    }
}
