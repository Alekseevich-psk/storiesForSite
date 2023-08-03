export default function animProgress(elements: NodeListOf<Element>, activeIndex: number) {

    const elem = elements[activeIndex];
    const progressItemsBG = elem.querySelectorAll('.stories-fs__progress-bg');
    const pictureItems = elem.querySelectorAll('.stories-fs__inner');

    autoPlay(progressItemsBG, true);
    autoPlay(pictureItems, false);

    function autoPlay(elements: NodeListOf<Element>, bgAnim: boolean) {
        removeActiveClass(elements);

        let activeIndex: number = 0;

        elements[activeIndex].classList.add('active');
        if (bgAnim) animationBg(elements[activeIndex]);

        let timer = setInterval(() => {
            elements[activeIndex].classList.remove('active');
            activeIndex++;
            if (bgAnim) animationBg(elements[activeIndex]);
            elements[activeIndex].classList.add('active');
            if (activeIndex == elements.length - 1) clearInterval(timer);
        }, 2000);
    }

    function animationBg(elem: Element) {
        let progressBgItem = elem as HTMLElement;
        let period: number = 10;
        let timer = setInterval(() => {
            progressBgItem.style.width = period + '%';
            period++;
            if (period == 100) clearInterval(timer);
        }, 20);
    }

    function removeActiveClass(elements: NodeListOf<Element>) {
        elements.forEach(element => {
            if (element.classList.contains('active')) element.classList.remove('active');
        });
    }
}