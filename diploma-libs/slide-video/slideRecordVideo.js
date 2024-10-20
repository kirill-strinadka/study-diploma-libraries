import {executeCommandToVideo, videoButtons} from './videoCommands.js';
import {SlideVideoBase} from './SlideVideoBase.js';

export class SlideRecordVideo extends SlideVideoBase {
    constructor(videoElement, toolsElement, videoSrc) {
        super(videoElement, videoSrc);

        this.toolsBlock = toolsElement;
        this.cmdByTimeArr = [];   // команды для видео

        // Создание кнопок из массива videoButtons
        videoButtons.forEach(({ label, command, title }) => {
            const button = document.createElement('button');
            button.title = title;
            button.appendChild(document.createTextNode(label));
            button.onclick = () => {
                // Отдельно обрабатываем кнопку пауза/запуска, чтобы ее иконка изменялась при нажатии
                if (command === 'play' || command === 'pause') {
                    this.togglePlayPause(button);
                } else {
                    this.recordAndExecuteCommand(command);
                }
            };
            this.toolsBlock.appendChild(button);
        });
    }

    start = () => { // Начать запись манипуляций с видео
        let date = new Date();
        this.startTime = date.getTime();
        console.log('! Recording startTime=' + this.startTime);
    }

    togglePlayPause = (button) => { // Переключатель Play/Pause
        if (this.isPlaying) {
            button.textContent = '▶️'; // Устанавливаем текст кнопки на Play
            this.recordAndExecuteCommand('pause');
        } else {
            button.textContent = '⏸️'; // Устанавливаем текст кнопки на Pause
            this.recordAndExecuteCommand('play');
        }
        this.isPlaying = !this.isPlaying; // Меняем состояние
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
