import {SlideObject} from "../../base-slide/SlideObject.js";

export class Slide2D extends SlideObject {

    constructor(slideHtmlContainer, backgroundImage) {
        super(slideHtmlContainer);
        this.type = "2d"

        this.slideBackgroundImage = backgroundImage;
    }

}
