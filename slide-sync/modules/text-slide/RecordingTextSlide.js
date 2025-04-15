
import {RecordingSlide} from "../base-slide/RecordingSlide.js";
import PlaybackTextSlide, {norm} from "./PlaybackTextSlide.js";

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

export default class RecordingTextSlide extends RecordingSlide {
    constructor(container, toolsContainer, ...restArgs) {
        super(container, toolsContainer, new PlaybackTextSlide(container, []));
        this.playbackSlide = new PlaybackTextSlide(container, [])
        this.container = container;
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
        this.playbackSlide.render();
    }

    startRecording() {
        this.recording = true;
        this.startTime = new Date().getTime();
        this.playbackSlide.clearContainer();
        this.container.addEventListener('click', this._onContainerClick);
    }

    stopRecording() {
        this.recording = false;
        this.container.removeEventListener('click', this._onContainerClick);
        return this.getSlideDTO();
    }

    play() {
        this._toInitState();
        super.play();
    }

    _onContainerClick = (event) => {
        if (!this.recording) return;

        const position = [event.offsetX, event.offsetY];
        const text = prompt('Введите текст:');
        if (text) {
            this._prepareCommandAndExecute('setTextColor', this.textColor);
            this._prepareCommandAndExecute('setTextFont', this.textFont);
            this._prepareCommandAndExecute('addText', { position: norm(position, this.uiManager.settings.width, this.uiManager.settings.height), text });
        }
    };

    _executeCommand(command) {
        this.playbackSlide._executeCommand(command)
    }

    getContent() {
        return this.playbackSlide.getContent();
    }

    getType() {
        return this.playbackSlide.getType();
    }

}

