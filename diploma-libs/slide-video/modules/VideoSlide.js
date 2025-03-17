import {Slide} from "../../base-slide/Slide.js";


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

    // Добавляй новые команды сюда
};

export function executeCommandToVideo(videoElement, command) {
    if (videoCommands[command[1]]) {
        videoCommands[command[1]](videoElement);
    } else {
        console.error(`Команда "${command[1]}" не распознана`);
    }
}


export class VideoSlide extends Slide {

    constructor(container, uiManager, videoSrc) {
        super(container);
        this.type = "video"
        this.container = container;

        this.uiManager = uiManager;
        this.toolManager = uiManager.getToolManager();

        // Используем уже существующий video-элемент или создаем новый
        this.videoSrc = videoSrc
        this.slideVideoElement = this.container.querySelector("video") || this.createVideoElement();
        this.slideVideoElement.src = videoSrc; // Обновляем src

        this.createTools(this.toolManager);

        this.instanceId = Math.random().toString(36).substring(2); // Уникальный ID экземпляра
        console.log(`VideoSlide created, instanceId: ${this.instanceId}`);

        this.initialVideoState = {
            currentTime: 0,
            playbackRate: 1.0,
            paused: true
        };
    }

    createVideoElement() {
        const video = document.createElement("video");
        video.style.width = "100%";
        video.style.height = "100%";
        this.container.appendChild(video);
        return video;
    }

    _recreateCanvas() {
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
                    console.log(`Button clicked, instanceId: ${this.instanceId}, this:`, this);
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

    _prepareCommandAndExecute(action, options) {
        console.log('Slide._prepareCommandAndExecute called on:', this);
        super._prepareCommandAndExecute(action, options)
    }


    render() {
        // Видео рендерится автоматически через элемент
        // Можно добавить логику, если требуется начальное состояние
    }

    startRecording() {
        // this.isPlaying = false;

        // Сохраняем начальное состояние видео
        this.initialVideoState = {
            currentTime: this.slideVideoElement.currentTime,
            playbackRate: this.slideVideoElement.playbackRate,
            paused: this.slideVideoElement.paused
        };

        super.startRecording(); // Инициализирует recording, startTime и очищает команды
        // this._recreateCanvas(); // Пересоздаем видео перед записью
    }

    stopRecording() {
        super.stopRecording(); // Сбрасывает recording и startTime
        // this.slideVideoElement.pause(); // Останавливаем видео
        // this.isPlaying = false;
        return this;
    }

    play() {
        this._recreateCanvas(); // Пересоздаем видео перед воспроизведением (в начальное состояние)
        super.play(); // Используем общую логику воспроизведения
    }

    _executeCommand(command) {

        executeCommandToVideo(this.slideVideoElement, command)
        // if (command[1] === 'play') this.isPlaying = true;
        // if (command[1] === 'pause') this.isPlaying = false;

    }

}

