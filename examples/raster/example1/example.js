
import { SlideLibrary, UIManager } from '../../../slide-sync';

// DOM-элементы
const slideContainer = document.getElementById('slide-container');
const toolsContainer = document.getElementById('tools-container');
const goBackButton = document.getElementById('go-back-button');
const example1Button = document.getElementById('example1-button');
const playExampleButton = document.getElementById('play-example-button');

// Инициализация UIManager
const uiManager = new UIManager(slideContainer, toolsContainer);

// Создание экземпляра SlideLibrary
const slideLib = new SlideLibrary(uiManager);

// Переменные для хранения текущего слайда и команд примера
let currentSlide = null;
let exampleCommands = null;

async function loadExample(exampleId) {
    uiManager.clearUI();
    if (exampleId === 'example1') {
        // Загрузка JSON с командами
        const response = await fetch('./example1/example1.json');
        const data = await response.json();
        exampleCommands = data; // Сохраняем команды

        // Инициализация растрового слайда с фоном из example1.png
        currentSlide = slideLib.createSlide('raster', './example1/example1.png');
        playExampleButton.disabled = false;
        console.log('Example 1 loaded with commands:', exampleCommands);
    }
}

function setupExampleControls() {
    playExampleButton.onclick = () => {
        if (currentSlide && exampleCommands) {
            currentSlide.commands = exampleCommands;
            currentSlide.play();
            console.log('Playing example commands:', exampleCommands);
        }
    };
}

// Обработчики
goBackButton.onclick = () => {
    window.location.href = 'index.html';
};

example1Button.onclick = () => {
    loadExample('example1').then(() => setupExampleControls());
};

// Инициализация при загрузке страницы (если нужно)
if (example1Button) {
    // Можно добавить автозагрузку первого примера при открытии страницы
    // loadExample('example1').then(() => setupExampleControls());
}