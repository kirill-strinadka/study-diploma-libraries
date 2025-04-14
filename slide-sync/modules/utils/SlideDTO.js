
export class SlideDTO {
    constructor(commands, content, type) {
        this.commands = commands; // Массив команд
        this.content = content;   // Контент слайда
        this.type = type;         // Тип слайда
    }
}