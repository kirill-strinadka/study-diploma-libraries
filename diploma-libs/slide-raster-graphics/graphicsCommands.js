import {denorm} from './utils.js';

export const slideCommands = {

    beginPath: (slideContext, options) => {
        slideContext.beginPath();
    },

    moveTo: (slideContext, options, width1, height1) => {
        let XY = denorm(options, width1, height1);
        slideContext.moveTo(XY[0], XY[1]);
    },

    lineTo: (slideContext, options, width1, height1) => {
        let XY = denorm(options, width1, height1);
        slideContext.lineTo(XY[0], XY[1]);
        slideContext.stroke();
    },

    closePath: (slideContext, options) => {
        slideContext.closePath();
    },

    setPenColor: (slideContext, options) => {
        slideContext.strokeStyle = options;
    },

    setPenWidth: (slideContext, options) => {
        slideContext.lineWidth = options;
    },

    // Добавляй новые команды сюда
};

// todo - мб можно создать объект контекста слайда, чтобы сюда его передавать и выполнять над ним действия. (мб сам SlideRecord подойдет)
export function executeCommandToGraphicSlide(slideContext, command, width1, height1) {
    let action = command[1];  // Здесь извлекаем действие (например, moveTo)
    let options = command[2]; // Здесь извлекаем опции

    // Проверка, есть ли такая команда в slideCommands
    if (slideCommands[action]) {
        // Передаем context, options и другие параметры в команду
        slideCommands[action](slideContext, options, width1, height1);
    } else {
        console.error(`Команда "${action}" не распознана`);
    }
}
