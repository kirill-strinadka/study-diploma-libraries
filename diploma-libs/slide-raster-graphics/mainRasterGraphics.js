import { SlideRecord2D } from './slideRecord2D.js';
import { SlidePlay2D } from './slidePlay2D.js';

// Подключение контейнеров
const slideElement = document.getElementById('slide-container');
const toolsElement = document.getElementById('tools-container');
const slideSrc = './img/first-image.jpg'; // Убедитесь, что путь к изображению правильный

// Создаем экземпляр SlideRecord2D и начинаем запись
const slideRecorder = new SlideRecord2D(slideElement, toolsElement, slideSrc);
slideRecorder.start(); // Начинаем запись (рисование пользователем)

// Добавление обработчика кнопки для запуска воспроизведения
const startPlaybackButton = document.getElementById('start-playback-button');
startPlaybackButton.addEventListener('click', () => {
    // Завершаем запись, если еще не завершена
    slideRecorder.finish();

    // Получаем записанные команды
    const recordedCommands = slideRecorder.getControls();

    // Воспроизводим записанные команды с помощью SlidePlay2D
    const slidePlayer = new SlidePlay2D(slideElement, slideSrc, recordedCommands);
    slidePlayer.start(); // Начинаем воспроизведение
});
