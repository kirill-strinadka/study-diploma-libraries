import { norm, denorm } from './utils.js';

export class SlideRecord2D {
    constructor(slideElement, toolsElement, slideSRC) {
        this.slideBlock = slideElement;
        this.toolsBlock = toolsElement;

        this.width1 = this.slideBlock.clientWidth;
        this.height1 = this.slideBlock.clientHeight;
        this.cmdArr = [];

        // создаем элемент 2D
        this.createCanvas(slideSRC);
        this.createTools();
        this.bindEvents();
    }

    createCanvas(slideSRC) {
        // создаем элемент 2D
        this.slideCanvas = document.createElement('canvas');
        this.slideCanvas.width = this.width1;
        this.slideCanvas.height = this.height1;
//		this.slideCanvas.style.borderStyle= 'double';
        this.slideBlock.appendChild (this.slideCanvas);
        this.slideContext = this.slideCanvas.getContext ('2d');
        let slideImg = new Image ();
        slideImg.onload = (function () {this.slideContext.drawImage (slideImg, 0, 0, this.width1, this.height1)}).bind(this);
        slideImg.src = slideSRC;
    }

    createTools() {
        //--tools
        this.thinPen = document.createElement ('button');
        this.thinPen.textContent = '❘';
        this.thinPen.setAttribute ('title','thin pen');
        this.toolsBlock.appendChild (this.thinPen);
        this.thinPen.onclick = (function() {this.penWidth = 3}).bind(this);

        this.mediumPen = document.createElement ('button');
        this.mediumPen.textContent = '❙';
        this.mediumPen.setAttribute ('title','medium pen');
        this.toolsBlock.appendChild (this.mediumPen);
        this.mediumPen.onclick = (function() {this.penWidth = 5}).bind(this);

        this.thickPen = document.createElement ('button');
        this.thickPen.textContent = '❚';
        this.thickPen.setAttribute ('title','thick pen');
        this.toolsBlock.appendChild (this.thickPen);
        this.thickPen.onclick = (function() {this.penWidth = 7}).bind(this);

        this.redPen = document.createElement ('button');
        this.redPen.textContent = '🟥';
        this.redPen.setAttribute ('title','red color');
        this.toolsBlock.appendChild (this.redPen);
        this.redPen.onclick = (function() {this.penColor = 'red'}).bind(this);

        this.greenPen = document.createElement ('button');
        this.greenPen.textContent = '🟩';
        this.greenPen.setAttribute ('title','green color');
        this.toolsBlock.appendChild (this.greenPen);
        this.greenPen.onclick = (function() {this.penColor = 'green'}).bind(this);

        this.bluePen = document.createElement ('button');
        this.bluePen.textContent = '🟦';
        this.bluePen.setAttribute ('title','blue color');
        this.toolsBlock.appendChild (this.bluePen);
        this.bluePen.onclick = (function() {this.penColor = 'blue'}).bind(this);
    }

    bindEvents() {
        //--
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.prepareCMD = this.prepareCMD.bind(this);
        this.execCMD = this.execCMD.bind(this);
    }

    start() {
        let date = new Date();
        this.t0 = date.getTime();
        this.penColor = 'red';
        this.penWidth = '3';
        this.slideCanvas.addEventListener('mousedown', this.onMouseDown); // включаем реагирование на рисование заметок
    }

    onMouseDown(event) {
        //	let t1 = (new Date()).getTime;
        let XY = [event.offsetX, event.offsetY]; // записываем в объект начальное время и координаты старта
        this.prepareCMD ('beginPath');
        this.prepareCMD ('setPenColor', this.penColor);
        this.prepareCMD ('setPenWidth', this.penWidth);
        this.prepareCMD ('moveTo', norm(XY, this.width1, this.height1));
        this.slideCanvas.addEventListener ('mousemove', this.onMouseMove);
        this.slideCanvas.addEventListener ('mouseup', this.onMouseUp);
    }

    onMouseMove(event) {
        let XY = [event.offsetX, event.offsetY];
        this.prepareCMD('lineTo', norm(XY, this.width1, this.height1));
    }

    onMouseUp() {
        this.prepareCMD('closePath');
        this.slideCanvas.removeEventListener('mousemove', this.onMouseMove);
    }

    prepareCMD(action, options) {
        let act = action;
        let command = [];
        let date = new Date();
        let t1 = date.getTime();
        command[0] = t1 - this.t0;
        command[1] = action;
        command[2] = options;
        this.cmdArr.push (command);
        this.execCMD (command);
    }

    execCMD(command) {
        let action = command [1];
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

    finish() {
        this.prepareCMD ('closePath');
        this.slideCanvas.removeEventListener ('mousemove', this.onMouseMove);
        this.slideCanvas.removeEventListener('mousedown', this.onMouseDown);
    }

    getControls() {
        return this.cmdArr;
    }
}
