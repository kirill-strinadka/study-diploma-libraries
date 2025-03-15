import {Slide} from "../../base-slide/Slide.js";

export class RasterGraphicsSlide extends Slide {
    constructor(container, backgroundImage) {
        super(container, { width: 600, height: 400 });
        this.type = 'raster';
        this.backgroundImage = backgroundImage;

        this._recreateCanvas()
    }

    _recreateCanvas() {
        this.clearCanvas()
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.settings.width;
        this.canvas.height = this.settings.height;
        this.context = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this._setupBackground();
    }

    _setupBackground() {
        if (this.backgroundImage) {
            const img = new Image();
            img.onload = () => this.context.drawImage(img, 0, 0, this.settings.width, this.settings.height);
            img.src = this.backgroundImage;
        }
    }

    render() {
        // Очистка и перерисовка на основе команд
        this.context.clearRect(0, 0, this.settings.width, this.settings.height);
        this._setupBackground();
        this.commands.forEach(cmd => this._executeCommand(cmd));
    }

    startRecording() {
        this.recording = true;
        this.canvas.addEventListener('mousedown', this._onMouseDown);
    }

    stopRecording() {
        this.recording = false;
        this.canvas.removeEventListener('mousedown', this._onMouseDown);
        return this;
    }

    play() {
        this._recreateCanvas()

        let i = 0;
        const playNext = () => {
            if (i < this.commands.length) {
                this._executeCommand(this.commands[i]);
                i++;
                setTimeout(playNext, this.commands[i - 1][0]); // Задержка из команды
            }
        };
        playNext();
    }

    _onMouseDown = (event) => {
        const start = [event.offsetX, event.offsetY];
        this.commands.push(['beginPath', start]);
        this.canvas.addEventListener('mousemove', this._onMouseMove);
        this.canvas.addEventListener('mouseup', this._onMouseUp);
    };

    _onMouseMove = (event) => {
        this.commands.push(['lineTo', [event.offsetX, event.offsetY]]);
        this.render(); // Немедленная обратная связь
    };

    _onMouseUp = () => {
        this.commands.push(['closePath']);
        this.canvas.removeEventListener('mousemove', this._onMouseMove);
        this.canvas.removeEventListener('mouseup', this._onMouseUp);
    };

    _executeCommand([action, args]) {
        switch (action) {
            case 'beginPath':
                this.context.beginPath();
                this.context.moveTo(...args);
                break;
            case 'lineTo':
                this.context.lineTo(...args);
                this.context.stroke();
                break;
            case 'closePath':
                this.context.closePath();
                this.context.stroke();
                break;
        }
    }
}
