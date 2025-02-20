import { SlideLibrary2D } from '../diploma-libs/slide-raster-graphics/index.js';
import { UIManager } from '../diploma-libs/control-application/UIManager.js';


const slideHtmlElement = document.getElementById('slide-container');
const toolsHtmlElement = document.getElementById('tools-container');
const slideBackgroundImageSrc = './img/first-image.jpg';

let uiManager = new UIManager(slideHtmlElement, toolsHtmlElement);
uiManager.setBackGroundImage(slideBackgroundImageSrc);

const slideLibrary = new SlideLibrary2D(
    uiManager,
    slideBackgroundImageSrc
);

const startRecordingButton = document.getElementById('start-recording-button');
const stopRecordingButton = document.getElementById('stop-recording-button');
const playbackButtonsContainer = document.getElementById('playback-buttons-container');

startRecordingButton.addEventListener('click', () => {
    const key = prompt('Введите название для этого набора команд:');
    slideLibrary.startRecording(key);
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
});

stopRecordingButton.addEventListener('click', () => {
    let recordingKey = slideLibrary.stopRecording();
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
    slideLibrary.createPlaybackButton(recordingKey, playbackButtonsContainer);
});
