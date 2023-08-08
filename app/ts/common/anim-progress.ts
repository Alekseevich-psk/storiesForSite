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
    let timerId: any = 0;
    let animTimerId: any = 0;
    let nextSlideTimerId: any = 0;

    wrapper.addEventListener('changeSlide', (event: CustomEvent) => {
        if (activeSlideIndex < elements.length - 1) updateAnimProgress();
    });

    wrapper.addEventListener('changeFullScreenMode', (event: CustomEvent) => {
        updateAnimProgress();
    });

    updateAnimProgress();
    playAnimation();

    progressItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            removeActiveClass(indexActiveItem)
            indexActiveItem = index;
            clearInterval(timerId);
            clearInterval(animTimerId);
            clearTimeout(nextSlideTimerId)
            playAnimation();
        });
    });

    function updateAnimProgress() {
        clearInterval(timerId);
        clearInterval(animTimerId);
        removeResAnimProgressBg(indexActiveItem);

        removeActiveClass(countItems);
        removeResAnimProgressBg(indexActiveItem);
    }

    function playAnimation() {
        progressItems[indexActiveItem].classList.add('active');
        pictureItems[indexActiveItem].classList.add('active');
        animProgressBg(indexActiveItem);

        timerId = setInterval(() => {
            changeActiveItem(indexActiveItem);
            if (indexActiveItem >= countItems) {
                clearInterval(timerId);

                nextSlideTimerId = setTimeout(() => {
                    wrapper.dispatchEvent(new CustomEvent("animSlide", {
                        detail: { animSlide: false }
                    }));
                }, speedChangeItems);
            }
        }, speedChangeItems);
    }

    function changeActiveItem(index: number) {
        progressItems[index].classList.remove('active');
        pictureItems[index].classList.remove('active');
        indexActiveItem++;
        clearInterval(animTimerId);
        animProgressBg(indexActiveItem);
        if (indexActiveItem >= countItems) indexActiveItem = countItems;
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
        if (progressItems[index].classList.contains('active')) progressItems[countItems].classList.remove('active');
        if (pictureItems[index].classList.contains('active')) pictureItems[countItems].classList.remove('active');
    }

    function removeResAnimProgressBg(index: number) {
        const bgItem = progressItemsBg[index] as HTMLElement;
        bgItem.style.width = 0 + '%';

        if (index < countItems) {
            index++;
            removeResAnimProgressBg(index);
        }
    }

}