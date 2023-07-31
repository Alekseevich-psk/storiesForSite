import { Options } from './types/options';
import widthSlides from './common/width-slides';


class storiesFs {

    private slidesStoriesFsEl = '.stories-fs__slide';

    private wrapperStoriesFs: Element;
    private slidesStoriesFs: NodeListOf<Element>;

    constructor(wrapper: string, options: Options) {
        this.initSfs(wrapper, options);
    }

    private initSfs(wrapper: string, options: Options) {
        this.wrapperStoriesFs = document.querySelector(wrapper) as Element;
        this.slidesStoriesFs = this.wrapperStoriesFs.querySelectorAll(this.slidesStoriesFsEl) as NodeListOf<Element>;

        if (this.wrapperStoriesFs === null) {
            console.error('Not found parent element');
            return false;
        }

        if (this.slidesStoriesFs.length <= 0) {
            console.error('Not found slides elements');
            return false;
        }

        widthSlides(this.wrapperStoriesFs, this.slidesStoriesFs, options);


    }
}

export default storiesFs;