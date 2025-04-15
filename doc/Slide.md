
---

### Базовые классы слайдов

[PlaybackSlide](../slide-sync/modules/base-slide/PlaybackSlide.js) - слайд реализующий функционал воспроизведения команд слайда

[RecordingSlide](../slide-sync/modules/base-slide/RecordingSlide.js) - слайд реализующий функционал записи команд слайда.

#### Описание
Это базовые абстрактные классы в полиморфной библиотеке для работы с динамическими слайдами. 
Они предоставляют общий интерфейс и базовую функциональность для всех типов реализаций слайдов 
(например, растровых, видео, текстовых), которые наследуются от них. 
Эти классы не предназначены для прямого использования — вместо этого они служат основой 
для создания конкретных реализаций слайдов, обеспечивая единообразие их поведения.

Классы определяют абстрактные методы, которые должны быть переопределены в подклассах 
для реализации конкретной логики.

`command` (Array) — массив `[timeInterval, action, options]` - единый интерфейс для команд.

#### Назначение
- **Унификация**: Обеспечивает единый интерфейс для всех типов слайдов, упрощая их интеграцию в библиотеку.
- **Полиморфизм**: Позволяет подклассам переопределять методы для реализации уникального поведения, сохраняя общую структуру.


### [PlaybackSlide](../slide-sync/modules/base-slide/PlaybackSlide.js)

Объект для воспроизведения команд.

#### Конструктор
```javascript
constructor(container, commands = [])
```

- **Параметры:**
  - `container` (HTMLElement): DOM-элемент, в котором будет отображаться слайд.
  - `commands` (Array): Массив команд для воспроизведения слайда.
  - `settings` (Object, опционально): Настройки слайда, такие как размеры (`width`, `height`) и другие параметры. По умолчанию: `{ width: 600, height: 400 }`.

#### Методы

##### `play()`
- **Описание**: Запускает воспроизведение команд слайда. Для него должен быть реализован метод `_executeCommand(command)`.

##### `getType()`
- **Описание**: Возвращает строку с названием типа конкретной реализации слайда.

##### `getSlideDTO()`
- **Описание**: Возвращает `SlideDTO` - объект необходимый для создания слайда из конструктора.
```js
export class SlideDTO {
    constructor(commands, content, type) {
        this.commands = commands; // Массив команд
        this.content = content;   // Контент слайда
        this.type = type;         // Тип слайда
    }
}
```

##### `getContent()`
- **Описание**: Возвращает дополнительный контент слайда (изображения, видео и т.п.). Зависист от реализации.

##### `clearContainer()`
- **Описание**: Очищает содержимое контейнера слайда в графическом интерфейса.
- **Использование**: Подготовка контейнера перед рендерингом нового содержимого.

##### `_executeCommand(command)`
- **Описание**: Применяет команду к HTML контейнеру слайда.

##### `_toInitState()`
- **Описание**: Очищает содержимое контейнера слайда в графическом интерфейса. 
Возвращает слайд к начальному состоянию, чтобы можно было его заново воспроизвести через `play()`


### [RecordingSlide](../slide-sync/modules/base-slide/RecordingSlide.js)

Объект для записи команд.

#### Конструктор
```javascript
constructor(container, toolsContainer, playbackSlide)
```

- **Параметры:**
  - `container` (HTMLElement): DOM-элемент, в котором будет отображаться слайд.
  - `toolsContainer` (HTMLElement): DOM-элемент, в котором будет отображаться панель инструментов
  - `playbackSlide` (PlaybackSlide): Объект реализации `PlaybackSlide`. 
Если его не передать, то в конструкторе создастся новый экземпляр. 
Его методы воспроизведения необходимы для моментального отображения действий команд на экране при записи.

#### Методы

##### `play()`
- **Описание**: Запускает воспроизведение команд слайда. Для него должен быть реализован метод `_executeCommand(command)`.


##### `createTools(toolManager)`
- **Описание**: Абстрактный метод для создания инструментов, специфичных для данного типа слайда. Вызывается с менеджером инструментов (`toolManager`). 
Каждый тип слайда может реализовывать свои инструменты по взаимодействию со слайдом.
- **Параметры**: `toolManager` (ToolManager) — объект для управления инструментами UI.
- **Выбрасывает**: `Error`, если не реализован в подклассе.

##### `startRecording()`
- **Описание**: Запускает таймер. Начинает запись команд.

##### `stopRecording()`
- **Описание**: Останавливает запись команд. Возвращает `SlideDTO`

##### `_prepareCommandAndExecute(action, options)`
- **Описание**: Запускает таймер. Начинает запись команд. 
- **Параметры**:
  - `action` (string): Тип действия (например, `'draw'` или `'move'`) (необходимо переопределять в реализации).
  - `options` (Object): Параметры действия (необходимо переопределять в реализации).
- **Примечание**: Работает только во время записи (`recording === true`).


#### Пример реализации
```javascript
export default class PlaybackTextSlide extends PlaybackSlide {
  constructor(container, content, commands = [], ...restArgs) {
    super(container, commands);

    this.type = 'text';

    this.textColor = 'black';
    this.textFont = '16px Arial';
    this.container.style.position = 'relative';
  }

  _toInitState() {}

  _getCanvas() {
    return this.canvas;
  }

  render() {
    this.clearContainer();
    this.commands.forEach(cmd => this._executeCommand(cmd));
  }

  play() {
    this._toInitState();
    super.play();
  }

  _executeCommand(command) {
    const action = command[1];
    const options = command[2];

    if (textCommands[action]) {
      textCommands[action](this, options, this.uiManager.settings.width, this.uiManager.settings.height);
    } else {
      console.error(`Команда "${action}" не распознана`);
    }
  }

  getContent() {
    return [];
  }

  getType() {
    return this.type;
  }

}
```

```js
export default class RecordingTextSlide extends RecordingSlide {
  constructor(container, toolsContainer, ...restArgs) {
    super(container, toolsContainer, new PlaybackTextSlide(container, []));
    this.playbackSlide = new PlaybackTextSlide(container, [])
    this.container = container;
  }

  createTools(toolManager) {
    const toolsConfig = [
      ...textColors.map(({ label, color, title }) => ({
        label,
        title,
        action: () => (this.textColor = color),
      })),
      ...textFonts.map(({ label, font, title }) => ({
        label,
        title,
        action: () => (this.textFont = font),
      })),
    ];

    toolManager.registerTools(toolsConfig);
  }

  getCreationArgs() {
    return [...this.getContent()];
  }

  render() {
    this.playbackSlide.render();
  }

  startRecording() {
    this.recording = true;
    this.startTime = new Date().getTime();
    this.playbackSlide.clearContainer();
    this.container.addEventListener('click', this._onContainerClick);
  }

  stopRecording() {
    this.recording = false;
    this.container.removeEventListener('click', this._onContainerClick);
    return this.getSlideDTO();
  }

  _onContainerClick = (event) => {
    if (!this.recording) return;

    const position = [event.offsetX, event.offsetY];
    const text = prompt('Введите текст:');
    if (text) {
      this._prepareCommandAndExecute('setTextColor', this.textColor);
      this._prepareCommandAndExecute('setTextFont', this.textFont);
      this._prepareCommandAndExecute('addText', { position: norm(position, this.uiManager.settings.width, this.uiManager.settings.height), text });
    }
  };

}
```

---
