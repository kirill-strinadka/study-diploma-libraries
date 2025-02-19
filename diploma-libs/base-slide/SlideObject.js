
export class SlideObject {
    constructor(slideHtmlContainer, width = 600, height = 400, border = '1px solid black') {

        this.settings = {
            width,
            height,
            border
        };

        this.type = "abstract";
        this.outerSlideHtmlContainer = slideHtmlContainer
        this.slideWidth = this.settings.width;
        this.slideHeight = this.settings.height;

        this.cmdArr = [];
    }

    getCommands() {
        return this.cmdArr;
    }

}
