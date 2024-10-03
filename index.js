// Получаем элементы из DOM
const slideElement = document.getElementById('slide-container');
const toolsElement = document.getElementById('tools-container');

const slideSrc = 'img/first_image_english.jpg';

// Создаем объект SlideRecord2D для записи взаимодействий
const slideRecorder = new SlideRecord2D(slideElement, toolsElement, slideSrc);
slideRecorder.start(); // Начинаем запись

const startRecordingButton = document.getElementById('start-recording');
const stopRecordingButton = document.getElementById('stop-recording');
const timerElement = document.getElementById('timer');

let recordingInterval = null;

// Начать запись
startRecordingButton.addEventListener('click', () => {
    slideRecorder.start();
    startTimer();
});

// Остановить запись
stopRecordingButton.addEventListener('click', () => {
    slideRecorder.finish();
    stopTimer();
});

// Функция для запуска таймера
function startTimer() {
    let startTime = Date.now();

    recordingInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);

        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Функция для остановки таймера
function stopTimer() {
    clearInterval(recordingInterval);
    timerElement.textContent = '00:00';
}

recordedCommands = slideRecorder.getControls(); // Получаем записанные команд
const slidePlayer = new SlidePlay2D(slideElement, slideSrc, recordedCommands);

// Добавление обработчика кнопки для запуска воспроизведения
const startPlaybackButton = document.getElementById('play-slide');
startPlaybackButton.addEventListener('click', () => {
    // // Завершаем запись, если еще не завершена
    // slideRecorder.finish();
    //
    // // Получаем записанные команды
    // const recordedCommands = slideRecorder.getControls();
    //
    // // Воспроизводим записанные команды с помощью SlidePlay2D
    // const slidePlayer = new SlidePlay2D(slideElement, slideSrc, recordedCommands);
    slidePlayer.start(); // Начинаем воспроизведение
});

// Найдем кнопку для остановки
const stopButton = document.getElementById('stop-slide');
stopButton.addEventListener('click', () => {
    slidePlayer.stop(); // Останавливаем воспроизведение

});

// // Через некоторое время можно вызвать finish, чтобы остановить запись
// setTimeout(() => {
//     slideRecorder.finish(); // Завершить запись
//     const recordedCommands = slideRecorder.getControls(); // Получаем записанные команды
//
//     // Воспроизводим записанные команды с помощью SlidePlay2D
//     const slidePlayer = new SlidePlay2D(slideElement, slideSrc, recordedCommands);
//     slidePlayer.start(); // Начинаем воспроизведение
// }, 10000); // Запись остановится через 10 секунд
