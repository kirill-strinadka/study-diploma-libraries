# Инструкция по использованию библиотеки слайдов

Данная библиотека позволяет записывать и воспроизводить команды для 2D и видео слайдов. Она поддерживает хранение команд, создание кнопок управления и простую интеграцию в веб-приложения.



## 1. Установка и подключение

Подключите библиотеку в ваш проект:

### Для 2D слайдов
```javascript
import { SlideLibrary2D } from '../multimedia-slides-library/slide-raster-graphics/index.js';
```

### Для видео слайдов
```javascript
import { SlideVideoLibrary } from '../multimedia-slides-library/slide-video';
```

## 2. Создание экземпляра библиотеки

### Для 2D слайдов
```javascript
const slideHtmlElement = document.getElementById('slide-container');
const toolsHtmlElement = document.getElementById('tools-container');
const slideBackgroundImageSrc = './img/first-image.jpg';

const slideLibrary = new SlideLibrary2D(
    slideHtmlElement,
    toolsHtmlElement,
    slideBackgroundImageSrc
);
```

### Для видео слайдов
```javascript
const videoHtmlContainer = document.getElementById('video-container');
const toolsHtmlContainer = document.getElementById('video-tools-container');
const videoSrc = '../video/first-video.mp4';

const slideVideoLibrary = new SlideVideoLibrary(
    videoHtmlContainer,
    toolsHtmlContainer,
    videoSrc
);
```

## 3. Управление записью команд

### Начало записи
```javascript
startRecordingButton.addEventListener('click', () => {
    const key = prompt('Введите название для этого набора команд:');
    slideLibrary.startRecording(key); // или slideVideoLibrary.startRecording(key)
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
});
```

### Остановка записи
```javascript
stopRecordingButton.addEventListener('click', () => {
    let recordingKey = slideLibrary.stopRecording(); // или slideVideoLibrary.stopRecording();
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
    slideLibrary.createPlaybackButton(recordingKey, playbackButtonsContainer);
});
```

## 4. Воспроизведение записанных команд
```javascript
slideLibrary.playRecording('название_команд');
```
или
```javascript
slideVideoLibrary.playRecording('название_команд');
```

## 5. Добавление кнопки воспроизведения
```javascript
slideLibrary.createPlaybackButton('название_команд', playbackButtonsContainer);
```
или
```javascript
slideVideoLibrary.createPlaybackButton('название_команд', videoPlaybackButtonsContainer);
```

## 6. Доступные модули

### Для 2D слайдов
```javascript
import { Slide2DLibrary, Slide2D, SlideRecord2D, SlidePlay2D } from './modules/Slide2DLibrary.js';
```

### Для видео слайдов
```javascript
import { SlideVideoLibrary, SlideVideo, SlideRecordVideo, SlidePlayVideo } from './modules/SlideVideoLibrary.js';
```

## Доступные классы и их использование

### 2D Слайды
```javascript
import { Slide2DLibrary as SlideLibrary2D, Slide2D, SlideRecord2D, SlidePlay2D } from './modules/Slide2DLibrary.js';
```

- `Slide2DLibrary` — основной класс для работы с 2D-слайдами (создание, запись, воспроизведение).
- `Slide2D` — класс, представляющий отдельный 2D-слайд.
- `SlideRecord2D` — класс для записи действий пользователя на слайде.
- `SlidePlay2D` — класс для воспроизведения записанных действий.

#### Использование:

```javascript
const slide = new RasterGraphicsSlide(slideHtmlElement, slideBackgroundImageSrc);
const recorder = new SlideRecord2D(toolsHtmlElement, slide);
recorder.start();
recorder.finish();
const player = new SlidePlay2D(slide);
player.start();
```

### Видео Слайды
```javascript
import { SlideVideoLibrary, SlideVideo, SlideRecordVideo, SlidePlayVideo } from './modules/SlideVideoLibrary.js';
```

- `SlideVideoLibrary` — основной класс для работы с видео-слайдами (создание, запись, воспроизведение).
- `SlideVideo` — класс, представляющий отдельный видео-слайд.
- `SlideRecordVideo` — класс для записи действий пользователя на видео-слайде.
- `SlidePlayVideo` — класс для воспроизведения записанных действий.

#### Использование:

```javascript
const slideVideo = new VideoSlide(videoHtmlContainer, videoSrc);
const recorderVideo = new SlideRecordVideo(toolsHtmlContainer, slideVideo);
recorderVideo.start();
recorderVideo.stopRecording();
const playerVideo = new SlidePlayVideo(slideVideo);
playerVideo.start();
```
