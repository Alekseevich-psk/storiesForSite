export default function animProgress(elements: NodeListOf<Element>, activeIndex: number) {

    const elem = elements[activeIndex];
    let indexItem: number = 0;

    const progressItems = elem.querySelectorAll('.stories-fs__progress-item');
    const pictureItems = elem.querySelectorAll('.stories-fs__inner');

    if (progressItems.length <= 0 || pictureItems.length <= 0) return;

    removeActiveClass(progressItems);
    removeActiveClass(pictureItems);

    progressItems[indexItem].classList.add('active');
    pictureItems[indexItem].classList.add('active');

    let timerId = setInterval(() => {
        playAnim();
        if (indexItem === progressItems.length - 1) clearInterval(timerId);
    }, 2000);

    progressItems.forEach((element, index) => {
        element.addEventListener('click', () => {
            playAnim(index);
            clearInterval(timerId);
        })
    });

    function playAnim(index: number | null = null) {
        progressItems[indexItem].classList.remove('active');
        pictureItems[indexItem].classList.remove('active');
        (index === null) ? indexItem++ : indexItem = index;
        progressItems[indexItem].classList.add('active');
        pictureItems[indexItem].classList.add('active');
    }

    function removeActiveClass(elements: NodeListOf<Element>) {
        elements.forEach(element => {
            if (element.classList.contains('active')) element.classList.remove('active');
        });
    }
}