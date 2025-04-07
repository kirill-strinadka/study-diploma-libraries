
// todo - Можно будет использовать как интерфейс для обращения к БД
export class SlideStorage {
    constructor() {
        this.storage = {}; // объект для хранения команд по ключам
    }

    // Метод для сохранения команд
    saveRecordedSlide(key, slide) {
        if (!Array.isArray(slide.commands)) {
            throw new Error('Commands must be an array');
        }
        this.storage[key] = slide;
        console.log(`Commands saved under key: ${key}`);
    }

    // Метод для получения команд по ключу
    getRecordedSlide(key) {
        const commands = this.storage[key];
        if (!commands) {
            console.warn(`No commands found for key: ${key}`);
            return null;
        }
        return commands;
    }

    // Метод для удаления команд по ключу
    removeRecordedSlide(key) {
        if (this.storage[key]) {
            delete this.storage[key];
            console.log(`Commands removed for key: ${key}`);
        } else {
            console.warn(`No commands found for key: ${key}`);
        }
    }

    // Метод для получения всех доступных ключей
    getAllKeys() {
        return Object.keys(this.storage);
    }

    clearStorage() {
        this.storage = {};
        console.log('Storage cleared');
    }

}