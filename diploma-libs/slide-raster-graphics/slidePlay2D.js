import { norm, denorm } from './utils.js';

export class SlidePlay2D {
    constructor(slideElement, slideSRC, Controls) {
        this.slideBlock = slideElement;
        this.slideBlock.innerHTML = '';
        this.width1 = this.slideBlock.clientWidth;
        this.height1 = this.slideBlock.clientHeight;
        this.cmdArr = Controls;

        this.createCanvas(slideSRC);


        this.execCMD = this.execCMD.bind(this);
        this.iCMD = 0;
        this.lastCMD = this.cmdArr.length-1;

        this.stop = this.stop.bind(this);
        this.restart = this.restart.bind(this);
        this.nextCMD = this.nextCMD.bind(this);
    }

    createCanvas(slideSRC) {
        // создаем элемент 2D
        this.slideCanvas = document.createElement('canvas');
        this.slideCanvas.width = this.width1;
        this.slideCanvas.height = this.height1;
        this.slideBlock.appendChild (this.slideCanvas);
        this.slideContext = this.slideCanvas.getContext ('2d');
        let slideImg = new Image ();
        slideImg.onload = (function () {this.slideContext.drawImage (slideImg, 0, 0, this.width1, this.height1)}).bind(this);
        slideImg.src = slideSRC;
    }

    start() {
        console.log (this.cmdArr.length);
        if (this.iCMD < this.lastCMD) {
            let cmd0 = this.cmdArr[this.iCMD];
            this.interval = cmd0[0];
            this.startTime = (new Date ()).getTime();
            this.setTimeID = setTimeout (this.nextCMD, this.interval);
        }
    }

    nextCMD() {
        console.log (this.iCMD);
        let cmd0 = this.cmdArr[this.iCMD];
        this.execCMD (cmd0);
        this.iCMD ++;
        if (this.iCMD < this.lastCMD) {
            let t0 = cmd0[0];
            let cmd1 = this.cmdArr[this.iCMD];
            let t1 = cmd1[0];
            this.interval = t1-t0;
            // this.interval = (t1 - t0) + delayBetweenCommands; // Добавляем задержку
            this.startTime = (new Date ()).getTime();
            this.setTimeID = setTimeout (this.nextCMD, this.interval);
        }
    }

    execCMD(command) {
        let action = command [1];
        console.log (action);
        let options = command[2];
        let XY = new Array ();
        switch (action) {
            case 'beginPath' :
                this.slideContext.beginPath ();
                break;
            case 'moveTo' :
                XY = denorm (options, this.width1, this.height1);
                this.slideContext.moveTo (XY[0], XY[1]);
                break;
            case 'lineTo' :
                XY = denorm (options, this.width1, this.height1);
                this.slideContext.lineTo (XY[0], XY[1]);
                this.slideContext.stroke ();
                break;
            case 'closePath' :
                this.slideContext.closePath ();
                break;
            case 'setPenColor' :
                this.slideContext.strokeStyle = options;
                break;
            case 'setPenWidth' :
                this.slideContext.lineWidth = options;
                break;
        }
    }

    stop() {
        clearTimeout (this.setTimeID);
        this.stopTime = (new Date ()).getTime();
    }

    restart() {
        let stopInterval = this.interval;
        this.interval = stopInterval - (this.stopTime - this.startTime);
        this.startTime = (new Date ()).getTime();
        this.setTimeID = setTimeout(this.nextCMD, this.interval);
    }
}
