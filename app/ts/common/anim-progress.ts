import { Options } from "../types/options";

export default function animProgress(wrapper: Element, elements: NodeListOf<Element>, activeSlideIndex: number, options: Options) {
    const element = elements[activeSlideIndex];
    const progressItems = element.querySelectorAll('.stories-fs__progress-item');
    const progressItemsBg = element.querySelectorAll('.stories-fs__progress-bg');
    const pictureItems = element.querySelectorAll('.stories-fs__inner');
    const speedChangeItems: number = (options.speedStory) ? options.speedStory : 3000;
    const speedProgressItems: number = speedChangeItems / 12;

    if (progressItems.length <= 0 || pictureItems.length <= 0 || progressItems.length !== pictureItems.length) return;

    const countItems: number = progressItems.length - 1;
    let indexActiveItem: number = 0;
    let nextItemTimerID: any = null;
    let animProgressBgTimerID: any = null;

    updateAnimProgress();
    playAnimation();

    progressItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            indexActiveItem = index;
            restartAnimationProgress();
        });
    });

    wrapper.addEventListener('holdEvent', (event: CustomEvent) => {
        (event.detail.holdEvent) ? pauseAnimationProgress() : restartAnimationProgress();
    });

    function restartAnimationProgress() {
        updateAnimProgress(indexActiveItem);
        playAnimation();
        createEventTouchItem();
    }

    function updateAnimProgress(index: number = 0) {
        clearInterval(nextItemTimerID);
        clearInterval(animProgressBgTimerID);
        removeResAnimProgressBg(index);
        removeActiveClass(index);
    }

    function pauseAnimationProgress() {
        clearInterval(nextItemTimerID);
        clearInterval(animProgressBgTimerID);
    }

    function playAnimation() {
        progressItems[indexActiveItem].classList.add('active');
        pictureItems[indexActiveItem].classList.add('active');
        animProgressBg(indexActiveItem);

        if (indexActiveItem <= countItems) {
            nextItemTimerID = setInterval(() => {
                changeActiveItem();
            }, speedChangeItems);
        }
    }

    function changeActiveItem() {
        console.log(options.autoPlayFullScreen);
        if (indexActiveItem >= countItems){
            clearInterval(nextItemTimerID); 
           
            if(options.autoPlayFullScreen) createEventAnimSlide();
            return;
        }

        progressItems[indexActiveItem].classList.remove('active');
        pictureItems[indexActiveItem].classList.remove('active');

        indexActiveItem++;
        clearInterval(animProgressBgTimerID);

        animProgressBg(indexActiveItem);
        progressItems[indexActiveItem].classList.add('active');
        pictureItems[indexActiveItem].classList.add('active');
    }

    function animProgressBg(index: number) {
        const bgItem = progressItemsBg[index] as HTMLElement;
        let start = 10;
        let step = 10;

        animProgressBgTimerID = setInterval(() => {
            bgItem.style.width = start + '%';
            start = start + step;
            if (start > 100) clearInterval(animProgressBgTimerID);
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

    const createEventAnimSlide = () => {
        wrapper.dispatchEvent(new CustomEvent("animSlide", {
            detail: { animSlide: false, activeSlide: activeSlideIndex }
        }));
    }

    const createEventTouchItem = () => {
        wrapper.dispatchEvent(new CustomEvent("changeItem", {
            detail: { animFlagChangeSlide: { interval: [nextItemTimerID, animProgressBgTimerID] } }
        }));
    }

    return { interval: [nextItemTimerID, animProgressBgTimerID] };
}