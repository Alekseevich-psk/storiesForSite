import { Options } from "../types/options";
import { paramPlayStory } from '../types/param-play-story';

export default function playStory(param: paramPlayStory) {
    
    const element = param.slidesStoriesFs[param.activeIndex];
    const options: Options = param.optionsSfs;
    console.log(options.speedStory / 100);
    
    const speedStory: number = options.speedStory / 100;

    const progressItems = element.querySelectorAll('.stories-fs__progress-item');
    const progressItemsBg = element.querySelectorAll('.stories-fs__progress-bg');
    const pictureItems = element.querySelectorAll('.stories-fs__inner');

    if (progressItems.length <= 0 || pictureItems.length <= 0 || progressItems.length !== pictureItems.length) return;

    const countItems: number = progressItems.length - 1;

    let indexActiveItem: number = param.activeIndexStory;
    let animProgressBgTimerID: any = null;

    playStory(indexActiveItem);

    function playStory(index: number) {

        if (indexActiveItem > countItems) {
            return createEventEndAnimSlide();
        }

        pictureItems[index].classList.add('active');
        animProgressBg(index);
        createEventChangeItem(index);
    }

    function animProgressBg(index: number) {
        const bgItem = progressItemsBg[index] as HTMLElement;
        let start = 1;
        let step = 1;

        animProgressBgTimerID = setInterval(() => {
            bgItem.style.width = start + '%';
            start = start + step;

            if (start > 100) {
                clearInterval(animProgressBgTimerID);
                indexActiveItem++;

                if (indexActiveItem <= countItems) {
                    playStory(indexActiveItem);
                    createEventChangeItem(indexActiveItem);
                }

                if (indexActiveItem > countItems && options.autoPlayFullScreen) {
                    createEventEndAnimSlide();
                }
            }
        }, speedStory);
    }

    function createEventEndAnimSlide() {
        param.wrapperStoriesFs.dispatchEvent(new CustomEvent("endAnimationSlide", {
            detail: { animSlide: false, activeSlide: param.activeIndex, intervals: [animProgressBgTimerID] }
        }));
    }

    function createEventChangeItem(index: number) {
        param.wrapperStoriesFs.dispatchEvent(new CustomEvent("changeItem", {
            detail: { intervals: [animProgressBgTimerID], index: index }
        }));
    }

    return { interval: [animProgressBgTimerID] };
}