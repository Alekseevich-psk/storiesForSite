export default function offSlide(elements: NodeListOf<Element>, activeSlideIndex: number, activeSlideIndexStory: number, timers: Array<number>) {
    if ((activeSlideIndex === 0 && activeSlideIndexStory === -1) || activeSlideIndex > elements.length - 1) return;
    const element = elements[activeSlideIndex];
    const progressItems = element.querySelectorAll('.stories-fs__progress-item');
    const pictureItems = element.querySelectorAll('.stories-fs__inner');
    const storiesProgressBg = element.querySelectorAll('.stories-fs__progress-bg');

    progressItems.forEach((element, index) => {
        if (element.classList.contains('active')) {
            element.classList.remove('active');
        }

        if (index < activeSlideIndexStory) {
            let elm = storiesProgressBg[index] as HTMLElement;
            elm.style.width = 100 + '%';
        }

        if (index > activeSlideIndexStory) {
            let elm = storiesProgressBg[index] as HTMLElement;
            elm.style.width = 0 + '%';
        }

    });

    for (let index = 0; index < progressItems.length; index++) {
        if (progressItems[index].classList.contains('active')) {
            progressItems[index].classList.remove('active');
        }

        if (pictureItems[index].classList.contains('active')) {
            pictureItems[index].classList.remove('active');
        }
    }

    if (timers !== null) {
        timers.forEach(el => {
            clearInterval(el);
        });
    }
}