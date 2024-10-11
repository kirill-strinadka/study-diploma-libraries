export class SlideRecordVideo {
    constructor(videoElement, toolsElement, videoSrc) {
        this.slideBlock = videoElement;
        this.toolsBlock = toolsElement;
        this.cmdArr = [];

        // Создаем элемент видео
        this.createVideoElement(videoSrc);

        // Создаем кнопку Play/Pause
        this.playPauseBTN = document.createElement('button');
        this.playPauseBTN.title = 'play';
        this.playPauseBTN.appendChild(document.createTextNode('▶️'));
        this.togglePlayPause = this.togglePlayPause.bind(this);
        this.playPauseBTN.onclick = this.togglePlayPause;
        this.toolsBlock.appendChild(this.playPauseBTN);

        // Создаем кнопку перемотки в начало
        this.onsetBTN = document.createElement('button');
        this.onsetBTN.title = 'begin';
        this.onsetBTN.appendChild(document.createTextNode('⏪'));
        this.clickOnset = this.clickOnset.bind(this);
        this.onsetBTN.onclick = this.clickOnset;
        this.toolsBlock.appendChild(this.onsetBTN);

    }

    createVideoElement(src) {
        this.rVideo = document.createElement('video');
        this.rVideo.src = src;
        this.rVideo.style.width = '100%';
        this.rVideo.style.height = '100%';
        this.slideBlock.appendChild(this.rVideo);
    }

    start() { // Начать запись манипуляций с видео
        let date = new Date();
        this.t0 = date.getTime();
        console.log('!t0=' + this.t0);
    }

    togglePlayPause() { // Переключатель Play/Pause
        if (this.playPauseBTN.textContent === '▶️') {
            this.playPauseBTN.textContent = '⏸️';
            this.prepareCMD('play');
        } else {
            this.playPauseBTN.textContent = '▶️';
            this.prepareCMD('pause');
        }
    }

    clickOnset() { // Перемотка в начало
        this.prepareCMD('onset');
    }

    prepareCMD(command) { // Подготовка команды для записи
        let arr = [];
        let date = new Date();
        let t1 = date.getTime();
        arr[0] = t1 - this.t0; // Время относительно начала записи
        arr[1] = command;
        this.cmdArr.push(arr);
        this.execCMD(command);
    }

    execCMD(cmd) { // Выполнение команды
        switch (cmd) {
            case 'play':
                this.rVideo.play();
                break;
            case 'pause':
                this.rVideo.pause();
                break;
            case 'onset':
                this.rVideo.currentTime = 0;
                break;
        }
    }

    finish() { // Завершить запись
        this.rVideo.pause();
    }

    getControls() { // Получить записанные команды
        return this.cmdArr;
    }
}
