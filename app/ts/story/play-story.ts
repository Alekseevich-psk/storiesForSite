import { Options } from "../types/options";

export default function playStory(wrapper: Element, elements: NodeListOf<Element>, activeSlideIndex: number, options: Options, activeIndexStory: number = 0) {
    const element = elements[activeSlideIndex];

    const speedChangeItems: number = options.speedStory;
    const speedProgressItems: number = speedChangeItems / 12;

    const progressItems = element.querySelectorAll('.stories-fs__progress-item');
    const progressItemsBg = element.querySelectorAll('.stories-fs__progress-bg');
    const pictureItems = element.querySelectorAll('.stories-fs__inner');

    if (progressItems.length <= 0 || pictureItems.length <= 0 || progressItems.length !== pictureItems.length) return;

    const countItems: number = progressItems.length - 1;
    
    let indexActiveItem: number = activeIndexStory;
    let nextItemTimerID: any = null;
    let animProgressBgTimerID: any = null;

    playStory(indexActiveItem);

    function playStory(index: number) {

        if(indexActiveItem > countItems) {
            return createEventEndAnimSlide();
        }
        
        pictureItems[index].classList.add('active');
        animProgressBg(index);
        createEventChangeItem(index);
    }

    function restartAnimationProgress() {

    }

    function updateAnimProgress(index: number = 0) {

    }

    function pauseAnimationProgress() {

    }

    function playAnimation() {

    }

    function changeActiveItem() {

    }

    function animProgressBg(index: number) {
        const bgItem = progressItemsBg[index] as HTMLElement;
        let start = 10;
        let step = 10;

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
        }, speedProgressItems);
    }

    function removeActiveClass(index: number) {
        if (progressItems[index].classList.contains('active')) progressItems[index].classList.remove('active');
        if (pictureItems[index].classList.contains('active')) pictureItems[index].classList.remove('active');
        if (index < countItems) index++, removeActiveClass(index);
    }

    function removeResAnimProgressBg(index: number) {
        const bgItem = progressItemsBg[index] as HTMLElement;
        bgItem.style.width = 0 + '%';
        if (index < countItems) index++, removeResAnimProgressBg(index);
    }

    function createEventEndAnimSlide() {
        wrapper.dispatchEvent(new CustomEvent("endAnimationSlide", {
            detail: { animSlide: false, activeSlide: activeSlideIndex, intervals: [animProgressBgTimerID] }
        }));
    }

    function createEventChangeItem(index: number) {
        wrapper.dispatchEvent(new CustomEvent("changeItem", {
            detail: { intervals: [animProgressBgTimerID], index: index }
        }));
    }

    return { interval: [animProgressBgTimerID] };
}