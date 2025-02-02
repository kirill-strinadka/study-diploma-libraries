import {executeCommandToVideo, videoButtons} from '../videoCommands.js';

export class SlideRecordVideoRefactor  {
    constructor(toolsElement, slideVideo) {

        this.slide = slideVideo;


        this.toolsBlock = toolsElement;
        // this.slide.cmdArr = [];   // команды для видео

        // Создание кнопок из массива videoButtons
        // todo - мне не нравится тут создание этих кнопок.
        videoButtons.forEach(({ label, command, title }) => {
            const button = document.createElement('button');
            console.log('Кнопка ', command, title);
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
        this.slide.cmdArr.push([timeOffset, command]);
        executeCommandToVideo(this.slide.slideVideoElement, command)
    }

    stopRecording() { // Завершить запись
        this.slide.slideVideoElement.pause();
    }

    getControls() { // Получить записанные команды
        return this.slide.cmdArr;
    }

    getRecordedSlide() {
        return this.slide;
    }

}
