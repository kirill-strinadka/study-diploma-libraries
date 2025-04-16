
import {PlaybackSlide} from "../base-slide/PlaybackSlide.js";

export function norm(XY, width, height) {
    return [Math.ceil((10000 * XY[0]) / width), Math.ceil((10000 * XY[1]) / height)];
}

export function denorm(xy, width, height) {
    return [Math.ceil((xy[0] * width) / 10000), Math.ceil((xy[1] * height) / 10000)];
}

export default class PlaybackTextSlide extends PlaybackSlide {
    constructor(container, content, commands = [], ...restArgs) {
        super(container, commands);

        this.type = 'text';

        this.textColor = 'black';
        this.textFont = '16px Arial';
        this.container.style.position = 'relative';
    }

    _toInitState() {
    }

    _getCanvas() {
        return this.canvas;
    }

    render() {
        this.clearContainer();
        this.commands.forEach(cmd => this._executeCommand(cmd));
    }

    play() {
        this._toInitState();
        super.play();
    }

    _executeCommand(command) {
        const action = command[1];
        const options = command[2];

        if (textCommands[action]) {
            textCommands[action](this, options, this.uiManager.settings.width, this.uiManager.settings.height);
        } else {
            console.error(`Команда "${action}" не распознана`);
        }
    }

    getContent() {
        return [];
    }

    getType() {
        return this.type;
    }

}

export const textCommands = {
    setTextColor: (slide, options) => {
        slide.textColor = options;
    },

    setTextFont: (slide, options) => {
        slide.textFont = options;
    },

    addText: (slide, options, width, height) => {
        const { position, text } = options;
        const [x, y] = denorm(position, width, height);

        const textElement = document.createElement('div');
        textElement.textContent = text;
        textElement.style.position = 'absolute';
        textElement.style.left = `${x}px`;
        textElement.style.top = `${y}px`;
        textElement.style.color = slide.textColor;
        textElement.style.font = slide.textFont;
        slide.container.appendChild(textElement);
    },
};


