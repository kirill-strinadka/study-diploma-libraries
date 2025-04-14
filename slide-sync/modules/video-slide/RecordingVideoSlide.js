import {Slide} from "./Slide.js";
import {RecordingSlide} from "../base-slide/RecordingSlide.js";
import PlaybackVideoSlide from "./PlaybackVideoSlide.js";


export const videoButtons = [
    { label: '▶️', command: 'play', title: 'Play' },
    { label: '⏪ 2.5s', command: 'skipBackward', title: 'Skip backward' },
    { label: '🔙', command: 'onset', title: 'Rewind to start' },
    { label: '⏩ 2.5s', command: 'skipForward', title: 'Skip forward' },
    { label: '+0.2x', command: 'speedUp', title: 'Speed up' },
    { label: '-0.2x', command: 'slowDown', title: 'Slow down' }
];

export default class RecordingVideoSlide extends RecordingSlide {

    constructor(container, toolsContainer, videoSrc, ...restArgs) {
        super(container, toolsContainer, new PlaybackVideoSlide(container, videoSrc, []));
        this.playbackSlide = new PlaybackVideoSlide(container, videoSrc, [])

        this.type = "video"

        this.createTools(this.toolManager);
    }


    getCreationArgs() {
        this.playbackSlide.getCreationArgs()
    }

    _toInitialState() {
        this.playbackSlide._toInitState();
    }

    createTools(toolManager) {

        toolManager.clearTools()

        videoButtons.forEach(({ label, command, title }) => {
            // Проверяем, есть ли уже кнопка с таким значением команды
            let button = toolManager.toolsContainer.querySelector(`button[data-command="${command}"]`);

            if (!button) {
                // Если кнопка не существует, создаем новую
                button = document.createElement('button');
                console.log('Кнопка ', command, title);
                button.title = title;
                button.setAttribute('data-command', command); // Добавляем уникальный атрибут для проверки
                button.appendChild(document.createTextNode(label));

                // Обработчик клика
                button.onclick = () => {
                    if (command === 'play' || command === 'pause') {
                        this.togglePlayPause(button);
                    } else {
                        this._prepareCommandAndExecute(command);
                    }
                };

                // Добавляем кнопку в контейнер
                toolManager.toolsContainer.appendChild(button);
            }
        });

        // todo - реализовать добавление кнопок через конфиг как в растровом слайде
        // const toolsConfig = videoButtons.map(({ label, command, title }) => ({
        //     label,
        //     title,
        //     action: () => {
        //         if (this.recording) {
        //             this.prepareCMD(command);
        //         }
        //         executeCommandToVideo(this.slideVideoElement, command);
        //     },
        // }));
        //
        // toolManager.registerTools(toolsConfig);
    }

    togglePlayPause = (button) => { // Переключатель Play/Pause
        if (this.isPlaying) {
            button.textContent = '▶️'; // Устанавливаем текст кнопки на Play
            this._prepareCommandAndExecute('pause');
        } else {
            button.textContent = '⏸️'; // Устанавливаем текст кнопки на Pause
            this._prepareCommandAndExecute('play');
        }
        this.isPlaying = !this.isPlaying; // Меняем состояние
    }

    render() {
        // Видео рендерится автоматически в браузере
        // Можно добавить логику, если требуется начальное состояние
    }

    startRecording() {
        // Сохраняем начальное состояние видео
        this.playbackSlide._saveInitialVideoState();

        super.startRecording();
    }

    stopRecording() {
        super.stopRecording();
        return this.getSlideDTO();
    }

    play() {
        this._toInitialState(); // Пересоздаем видео перед воспроизведением (в начальное состояние сбрасываем)
        super.play(); // Используем общую логику воспроизведения
    }

    getContent() {
        return this.playbackSlide.getContent(); // Контент — путь к видео или само видео
    }

    getType() {
        this.playbackSlide.getType();
    }
}

