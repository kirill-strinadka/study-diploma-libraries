import { executeCommandToVideo } from './videoCommands.js';
import {SlideVideoBase} from './SlideVideoBase.js';

export class SlideRecordVideo extends SlideVideoBase {
    constructor(videoElement, toolsElement, videoSrc) {
        super(videoElement, videoSrc);

        this.toolsBlock = toolsElement;
        this.cmdByTimeArr = [];   // команды для видео

        // Создаем кнопку Play/Pause
        this.playPauseBTN = document.createElement('button');
        this.playPauseBTN.title = 'play';
        this.playPauseBTN.appendChild(document.createTextNode('▶️'));
        this.playPauseBTN.onclick = this.togglePlayPause;
        this.toolsBlock.appendChild(this.playPauseBTN);

        // Создаем кнопку перемотки в начало
        this.onsetBTN = document.createElement('button');
        this.onsetBTN.title = 'begin';
        this.onsetBTN.appendChild(document.createTextNode('⏪'));
        this.onsetBTN.onclick = this.clickOnset;
        this.toolsBlock.appendChild(this.onsetBTN);
    }

    start = () => { // Начать запись манипуляций с видео
        let date = new Date();
        this.startTime = date.getTime();
        console.log('! Recording startTime=' + this.startTime);
    }

    togglePlayPause = () => { // Переключатель Play/Pause
        if (this.playPauseBTN.textContent === '▶️') {
            this.playPauseBTN.textContent = '⏸️';
            this.recordAndExecuteCommand('play');
        } else {
            this.playPauseBTN.textContent = '▶️';
            this.recordAndExecuteCommand('pause');
        }
    }

    clickOnset = () => { // Перемотка в начало
        this.recordAndExecuteCommand('onset');
    }

    recordAndExecuteCommand(command) { // Подготовка команды для записи
        const timeOffset = Date.now() - this.startTime;
        this.cmdByTimeArr.push([timeOffset, command]);
        executeCommandToVideo(this.slideVideoElement, command)
    }

    stopRecording() { // Завершить запись
        this.slideVideoElement.pause();
    }

    getControls() { // Получить записанные команды
        return this.cmdByTimeArr;
    }

}
