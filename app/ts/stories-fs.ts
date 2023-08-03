import { onBtnArrow, offBtnArrow, getWidthElem, animFade } from './common/helpers';

import widthSlides from './common/width-slides';
import initControl from './common/init-control';
import initFullScreen from './common/init-fullscreen';
import initProgress from './common/init-progress';
import animProgress from './common/anim-progress';

import { Options } from './types/options';
import { Arrows } from './types/arrows';


class storiesFs {

    private trackStoriesFsEl = '.stories-fs__track';
    private slidesStoriesFsEl = '.stories-fs__slide';

    private activeIndex: number = 0;
    private widthSlide: number;
    private countScrollWrapper: number = 0;
    private playAnimScroll: boolean = false;
    private fullScreenMode: boolean = false;

    private wrapperStoriesFs: Element;
    private trackStoriesFs: HTMLElement;
    private slidesStoriesFs: NodeListOf<Element>;

    private arrowsBtnEl: Arrows;

    constructor(wrapper: string, options: Options) {
        this.initSfs(wrapper, options);
    }

    private initSfs(wrapper: string, options: Options) {
        this.wrapperStoriesFs = document.querySelector(wrapper) as Element;
        this.trackStoriesFs = this.wrapperStoriesFs.querySelector(this.trackStoriesFsEl) as HTMLElement;
        this.slidesStoriesFs = this.wrapperStoriesFs.querySelectorAll(this.slidesStoriesFsEl) as NodeListOf<Element>;

        if (this.wrapperStoriesFs === null) {
            console.error('Not found parent element');
            return false;
        }

        if (this.slidesStoriesFs.length <= 0) {
            console.error('Not found slides elements');
            return false;
        }

        this.widthSlide = widthSlides(this.wrapperStoriesFs, this.slidesStoriesFs, options);
        this.arrowsBtnEl = initControl(this.wrapperStoriesFs, options);

        initFullScreen(this.wrapperStoriesFs, this.slidesStoriesFs);
        initProgress(this.slidesStoriesFs);

        this.wrapperStoriesFs.addEventListener('changeSlide', (event: CustomEvent) => {
            if ((event.detail.btn === 'prev')) this.prevSlide();
            if ((event.detail.btn === 'next')) this.nextSlide();
        })

        this.wrapperStoriesFs.addEventListener('changeFullScreenMode', (event: CustomEvent) => {

            this.widthSlide = widthSlides(this.wrapperStoriesFs, this.slidesStoriesFs, options, event.detail.fullScreen);
            this.fullScreenMode = event.detail.fullScreen;

            if (event.detail.activeIndex) this.activeIndex = event.detail.activeIndex;
            if (event.detail.fullScreen) animProgress(this.slidesStoriesFs, this.activeIndex);;

            this.scrollSliderOnFullScreen(this.trackStoriesFs, this.activeIndex, this.fullScreenMode);
            // animFade(this.wrapperStoriesFs);
        })

    }

    private prevSlide() {
        if ((this.countScrollWrapper - this.widthSlide) < 0) return;
        if (!this.playAnimScroll) this.animationScroll(this.trackStoriesFs, 'prev');
    }

    private nextSlide() {
        if (this.checkCountSlideForScrollNext()) return;
        if (!this.playAnimScroll) this.animationScroll(this.trackStoriesFs, 'next');
    }

    private animationScroll(wrapper: HTMLElement, direction: string) {
        const speed: number = 1;
        let period: number = 14;

        if (this.fullScreenMode) {
            period = 10;
            (direction == 'next') ? this.activeIndex++ : this.activeIndex--;
            console.log(this.activeIndex, this.countScrollWrapper);
            
            animProgress(this.slidesStoriesFs, this.activeIndex);
        }

        let start: number = this.countScrollWrapper;
        this.playAnimScroll = true;

        (direction == 'next') ? this.countScrollWrapper += this.widthSlide : this.countScrollWrapper -= this.widthSlide;

        let timerId = setInterval(() => {
            wrapper.style.transform = `translate3d(${-1 * start + 'px'}, 0, 0)`;
            (direction == 'next') ? start += period : start -= period;
            if (start > this.countScrollWrapper && direction == 'next' || start < this.countScrollWrapper && direction == 'prev') {
                wrapper.style.transform = `translate(${-1 * (start - (start - this.countScrollWrapper)) + 'px'}, 0)`;
                clearInterval(timerId);
                this.playAnimScroll = false;
            };
        }, speed);

        (this.countScrollWrapper > 0) ? onBtnArrow(this.arrowsBtnEl.defBtnPrev) : offBtnArrow(this.arrowsBtnEl.defBtnPrev);
        (!this.checkCountSlideForScrollNext()) ? onBtnArrow(this.arrowsBtnEl.defBtnNext) : offBtnArrow(this.arrowsBtnEl.defBtnNext);
    }

    private scrollSliderOnFullScreen(wrapper: HTMLElement, index: number, fullScreen: boolean) {
        const widthWindow = getWidthElem(this.wrapperStoriesFs);
        const widthSlidesInActive = (index + 1) * this.widthSlide;

        let distance: number;

        if (fullScreen) {
            distance = this.widthSlide * index;
            return wrapper.style.transform = `translate(${-1 * distance + 'px'}, 0)`;
        }

        if (widthSlidesInActive <= widthWindow) {
            distance = 0;
        } else {
            distance = widthSlidesInActive - widthWindow;
        }

        wrapper.style.transform = `translate(${-1 * distance + 'px'}, 0)`;
    }

    private checkCountSlideForScrollNext() {
        return (this.countScrollWrapper >= (this.slidesStoriesFs.length * this.widthSlide) - getWidthElem(this.wrapperStoriesFs))
    }

}

export default storiesFs;