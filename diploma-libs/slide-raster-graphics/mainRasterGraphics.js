import { SlideRecord2D } from './slideRecord2D.js';
import { SlidePlay2D } from './slidePlay2D.js';
import {SlideObject} from "./SlideObject.js";
import {SlideStorage} from "./SlideStorage.js";

// Создаем экземпляр хранилища команд
const slideStorage = new SlideStorage();

// Подключение контейнеров
const slideElement = document.getElementById('slide-container');
const toolsElement = document.getElementById('tools-container');
const slideSrc = './img/first-image.jpg';

// Переменные для управления записью
let slideRecorder = null;
let recordingKey = null;

// Контейнер для динамических кнопок
const playbackButtonsContainer = document.getElementById('playback-buttons-container');

// Кнопки управления записью
const startRecordingButton = document.getElementById('start-recording-button');
const stopRecordingButton = document.getElementById('stop-recording-button');

// Обработчик для начала записи
startRecordingButton.addEventListener('click', () => {
    recordingKey = prompt('Введите название для этого набора команд:');
    if (!recordingKey) {
        alert('Название обязательно!');
        return;
    }

    // Очищаем предыдущие записи
    slideElement.innerHTML = '';

    let slide2D = new SlideObject(slideSrc);

    // Создаем новый экземпляр SlideRecord2D и начинаем запись
    slideRecorder = new SlideRecord2D(slideElement, toolsElement, slide2D);
    slideRecorder.start();

    // Активируем и деактивируем кнопки
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
});

// Обработчик для завершения записи
stopRecordingButton.addEventListener('click', () => {
    if (!slideRecorder) return;

    // Останавливаем запись
    slideRecorder.finish();

    const recordedSlide = slideRecorder.getRecordedSlide();
    slideStorage.saveCommands(recordingKey, recordedSlide);

    // Создаем новую кнопку воспроизведения для этого набора команд
    createPlaybackButton(recordingKey);

    // Сбрасываем управление
    slideRecorder = null;
    recordingKey = null;
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
});

// Функция для создания кнопки воспроизведения
function createPlaybackButton(key) {
    const button = document.createElement('button');
    button.textContent = `Воспроизвести: ${key}`;
    button.addEventListener('click', () => {
        let slide2D = slideStorage.getCommands(key)
        if (slide2D) {
            const slidePlayer = new SlidePlay2D(slideElement, slide2D);
            slidePlayer.start(); // Запускаем воспроизведение
        } else {
            alert(`Команды для ключа "${key}" не найдены.`);
        }
    });

    // Добавляем кнопку в контейнер
    playbackButtonsContainer.appendChild(button);
}
