// ─────────────────────────── RecordingRasterSlide.js ──────────────────────────────────

import {RecordingSlide} from "../base-slide/RecordingSlide.js";
import PlaybackRasterSlide, {norm} from "./PlaybackRasterSlide.js";

// Массив настроек толщины линий ручки
export const penWidths = [
    {label: '❘', width: 3, title: 'thin pen'},
    {label: '❙', width: 5, title: 'medium pen'},
    {label: '❚', width: 7, title: 'thick pen'}
];

// Массив настроек цветов ручки
export const penColors = [
    {label: '🟥', color: 'red', title: 'red color'},
    {label: '🟩', color: 'green', title: 'green color'},
    {label: '🟦', color: 'blue', title: 'blue color'}
];

export default class RecordingRasterSlide extends RecordingSlide {
    constructor(container, toolsContainer, backgroundImage, ...restArgs) {
        super(container, toolsContainer, new PlaybackRasterSlide(container, [], backgroundImage));
        this.playbackSlide = new PlaybackRasterSlide(container, backgroundImage, [])

        // todo - команды воспроизводятся на слайде воспроизведения => тут определение команд даже для инструментов не нужно
        this.penColor = 'black';
        this.penWidth = 1;
    }

    createTools(toolManager) {
        const toolsConfig = [
            ...penColors.map(({label, color, title}) => ({
                label,
                title,
                action: () => (this.penColor = color),
            })),
            ...penWidths.map(({label, width, title}) => ({
                label,
                title,
                action: () => (this.penWidth = width),
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
        this._toInitState()
        this.playbackSlide._getCanvas().addEventListener('mousedown', this._onMouseDown);
    }

    stopRecording() {
        this.recording = false;
        this.playbackSlide._getCanvas().removeEventListener('mousedown', this._onMouseDown);
        return this.getSlideDTO();
    }

    play() {
        this._toInitState();
        super.play();
    }

    _executeCommand(command) {
        this.playbackSlide._executeCommand(command)
    }

    getContent() {
        return [this.playbackSlide.getContent()];
    }

    getType() {
        return this.playbackSlide.getType();
    }

    _onMouseDown = (event) => {
        const start = [event.offsetX, event.offsetY];

        this._prepareCommandAndExecute('beginPath');
        this._prepareCommandAndExecute('setPenColor', this.penColor);
        this._prepareCommandAndExecute('setPenWidth', this.penWidth);
        this._prepareCommandAndExecute('moveTo', norm(start, this.uiManager.settings.width, this.uiManager.settings.height));

        this.playbackSlide._getCanvas().addEventListener('mousemove', this._onMouseMove);
        this.playbackSlide._getCanvas().addEventListener('mouseup', this._onMouseUp);
    };

    _onMouseMove = (event) => {
        let XY = [event.offsetX, event.offsetY];
        this._prepareCommandAndExecute('lineTo', norm(XY, this.uiManager.settings.width, this.uiManager.settings.height));
    };

    _onMouseUp = () => {
        this._prepareCommandAndExecute('closePath');
        this.playbackSlide._getCanvas().removeEventListener('mousemove', this._onMouseMove);
    };

}

