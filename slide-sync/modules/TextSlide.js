// modules/TextSlide.js (альтернативная реализация)
import { Slide } from "./Slide.js";
import { norm, denorm } from "./RasterGraphicsSlide.js";

export const textFonts = [
    { label: '🅰️ Small', font: '16px Arial', title: 'Small font' },
    { label: '🅰️ Medium', font: '24px Arial', title: 'Medium font' },
    { label: '🅰️ Large', font: '32px Arial', title: 'Large font' }
];

export const textColors = [
    { label: '🟥', color: 'red', title: 'Red color' },
    { label: '🟩', color: 'green', title: 'Green color' },
    { label: '🟦', color: 'blue', title: 'Blue color' }
];

export default class TextSlide extends Slide {
    constructor(container, uiManager, ...restArgs) {
        super(container, uiManager, { width: 600, height: 400 });
        this.type = 'text';

        this.textColor = 'black';
        this.textFont = '16px Arial';

        this.container.style.position = 'relative';
        this.createTools(this.toolManager);
    }

    createTools(toolManager) {
        const toolsConfig = [
            ...textColors.map(({ label, color, title }) => ({
                label,
                title,
                action: () => (this.textColor = color),
            })),
            ...textFonts.map(({ label, font, title }) => ({
                label,
                title,
                action: () => (this.textFont = font),
            })),
        ];
        toolManager.registerTools(toolsConfig);
    }

    getCreationArgs() {
        return [...this.getContent()];
    }

    render() {
        this.clearContainer();
        this.commands.forEach(cmd => this._executeCommand(cmd));
    }

    startRecording() {
        this.recording = true;
        this.startTime = new Date().getTime();
        this.clearContainer();
        this.container.addEventListener('click', this._onContainerClick);
    }

    stopRecording() {
        this.recording = false;
        this.container.removeEventListener('click', this._onContainerClick);
        return this;
    }

    play() {
        this.clearContainer();
        super.play();
    }

    _onContainerClick = (event) => {
        if (!this.recording) return;

        const position = [event.offsetX, event.offsetY];
        const text = prompt('Введите текст:');
        if (text) {
            this._prepareCommandAndExecute('setTextColor', this.textColor);
            this._prepareCommandAndExecute('setTextFont', this.textFont);
            this._prepareCommandAndExecute('addText', { position: norm(position, this.settings.width, this.settings.height), text });
        }
    };

    _executeCommand(command) {
        const action = command[1];
        const options = command[2];

        if (textCommands[action]) {
            textCommands[action](this, options, this.settings.width, this.settings.height);
        } else {
            console.error(`Команда "${action}" не распознана`);
        }
    }

    // todo - превратить в массив или более сложный объект
    getContent() {
        return [];
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

