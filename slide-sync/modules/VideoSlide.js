import {Slide} from "./Slide.js";


export const videoButtons = [
    { label: '▶️', command: 'play', title: 'Play' },
    { label: '⏪ 2.5s', command: 'skipBackward', title: 'Skip backward' },
    { label: '🔙', command: 'onset', title: 'Rewind to start' },
    { label: '⏩ 2.5s', command: 'skipForward', title: 'Skip forward' },
    { label: '+0.2x', command: 'speedUp', title: 'Speed up' },
    { label: '-0.2x', command: 'slowDown', title: 'Slow down' }
];

export const videoCommands = {
    play: (videoElement) => videoElement.play(),
    pause: (videoElement) => videoElement.pause(),
    onset: (videoElement) => { videoElement.currentTime = 0; },
    skipForward: (videoElement) => { videoElement.currentTime += 2.5; },
    skipBackward: (videoElement) => { videoElement.currentTime -= 2.5; },
    speedUp: (videoElement) => {videoElement.playbackRate =
        Math.min(3.0, videoElement.playbackRate + 0.2); },
    slowDown: (videoElement) => {videoElement.playbackRate =
        Math.max(0.2, videoElement.playbackRate - 0.2);}

};

export function executeCommandToVideo(videoElement, command) {
    if (videoCommands[command[1]]) {
        videoCommands[command[1]](videoElement);
    } else {
        console.error(`Команда "${command[1]}" не распознана`);
    }
}


export default class VideoSlide extends Slide {

    constructor(container, uiManager, videoSrc, settings = {}) {
        super(container, uiManager, {width: 600, height: 400});
        this.type = "video"
        this.container = container;

        // Используем уже существующий video-элемент или создаем новый
        this.videoSrc = videoSrc
        this.slideVideoElement = this.container.querySelector("video") || this.createVideoElement();
        this.slideVideoElement.src = videoSrc; // Обновляем src

        // Начальное состояние видео, чтобы потом воспроизводить команды с этого момента
        this.initialVideoState = {
            currentTime: 0,
            playbackRate: 1.0,
            paused: true
        };

        this.createTools(this.toolManager);
    }

    createVideoElement() {
        const video = document.createElement("video");
        video.style.width = "100%";
        video.style.height = "100%";
        this.container.appendChild(video);
        return video;
    }

    _toInitialState() {
        this.slideVideoElement.currentTime = this.initialVideoState.currentTime;
        this.slideVideoElement.playbackRate = this.initialVideoState.playbackRate;
        this.slideVideoElement.pause();
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
        this.initialVideoState = {
            currentTime: this.slideVideoElement.currentTime,
            playbackRate: this.slideVideoElement.playbackRate,
            paused: this.slideVideoElement.paused
        };

        super.startRecording();
    }

    stopRecording() {
        super.stopRecording();
        return this;
    }

    play() {
        this._toInitialState(); // Пересоздаем видео перед воспроизведением (в начальное состояние сбрасываем)
        super.play(); // Используем общую логику воспроизведения
    }

    _executeCommand(command) {
        executeCommandToVideo(this.slideVideoElement, command)
    }

}

