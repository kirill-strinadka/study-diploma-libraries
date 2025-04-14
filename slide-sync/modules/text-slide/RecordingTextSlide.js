
import {RecordingSlide} from "../base-slide/RecordingSlide.js";
import PlaybackTextSlide from "./PlaybackTextSlide.js";

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

export default class RecordingTextSlide extends RecordingSlide {
    constructor(container, toolsContainer, ...restArgs) {
        super(container, toolsContainer, new PlaybackTextSlide(container, []));
        this.playbackSlide = new PlaybackTextSlide(container, [])
        this.container = container;

        this._toInitState()
        // this.createTools(this.toolManager);
    }

    _toInitState() {
        this.playbackSlide._toInitState();
    }

    createTools(toolManager) {
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
        this.clearContainer();
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

    _executeCommand(command) {
        this.playbackSlide._executeCommand(command)
    }

    getContent() {
        return this.playbackSlide.getContent();
    }

}

