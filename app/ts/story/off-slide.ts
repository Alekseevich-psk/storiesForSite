export default function offSlide(elements: NodeListOf<Element>, activeSlideIndex: number, activeSlideIndexStory: number, timers: Array<number>) {
    if ((activeSlideIndex === 0 && activeSlideIndexStory === -1) || activeSlideIndex > elements.length - 1) return;
    const element = elements[activeSlideIndex];

    const progressItems = element.querySelectorAll('.stories-fs__progress-item');
    const pictureItems = element.querySelectorAll('.stories-fs__inner');

    progressItems.forEach(element => {
        if (element.classList.contains('active')) {
            element.classList.remove('active');
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