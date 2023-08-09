export default function animProgress(wrapper: Element, elements: NodeListOf<Element>, activeSlideIndex: number) {

    const element = elements[activeSlideIndex];
    const progressItems = element.querySelectorAll('.stories-fs__progress-item');
    const progressItemsBg = element.querySelectorAll('.stories-fs__progress-bg');
    const pictureItems = element.querySelectorAll('.stories-fs__inner');
    const speedChangeItems: number = 2000;
    const speedProgressItems: number = speedChangeItems / 15;

    if (progressItems.length <= 0 || pictureItems.length <= 0 || progressItems.length !== pictureItems.length) return;

    const countItems: number = progressItems.length - 1;

    let indexActiveItem: number = 0;
    let timerId: any = null;
    let animTimerId: any = null;
    let nextSlideTimerId: any = null;

    updateAnimProgress();
    playAnimation();

    progressItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateAnimProgress(index);
            indexActiveItem = index;
            playAnimation();
            createEventTouchItem();
        });
    });

    function updateAnimProgress(index: number = 0) {
        clearInterval(timerId);
        clearInterval(animTimerId);
        clearTimeout(nextSlideTimerId);
        removeResAnimProgressBg(index);
        removeActiveClass(index);
    }

    function playAnimation() {
        progressItems[indexActiveItem].classList.add('active');
        pictureItems[indexActiveItem].classList.add('active');
        animProgressBg(indexActiveItem);

        if (indexActiveItem < countItems) {
            timerId = setInterval(() => {
                changeActiveItem();
                if (indexActiveItem >= countItems) {
                    clearInterval(timerId);
                    nextSlideTimerId = setTimeout(createEventAnimSlide, speedChangeItems);
                }
            }, speedChangeItems);
        }
    }

    function changeActiveItem() {
        progressItems[indexActiveItem].classList.remove('active');
        pictureItems[indexActiveItem].classList.remove('active');

        indexActiveItem++;
        clearInterval(animTimerId);

        animProgressBg(indexActiveItem);
        progressItems[indexActiveItem].classList.add('active');
        pictureItems[indexActiveItem].classList.add('active');
    }

    function animProgressBg(index: number) {
        const bgItem = progressItemsBg[index] as HTMLElement;
        let start = 10;
        let step = 10;

        animTimerId = setInterval(() => {
            bgItem.style.width = start + '%';
            start = start + step;
            if (start > 100) clearInterval(animTimerId);
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
            detail: { animFlagChangeSlide: { interval: [timerId, animTimerId], timer: [nextSlideTimerId] } }
        }));
    }

    return { interval: [timerId, animTimerId], timer: [nextSlideTimerId] };
}