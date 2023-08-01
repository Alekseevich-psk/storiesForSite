import { Options } from '../types/options';

export default function createProgress(slides: NodeListOf<Element>, options: Options) {
    const speed: number = 3000;

    slides.forEach((element) => {
        const slideWrapper = element.querySelector('.stories-fs__wrapper');
        const slideInner = element.querySelectorAll('.stories-fs__inner') as NodeListOf<Element>;

        let activeIndex: number = 0;

        const progressWrapperHTML = `<div class="stories-fs__progress"></div>`;
        slideWrapper.insertAdjacentHTML('afterbegin', progressWrapperHTML);

        const progressWrapper = element.querySelector('.stories-fs__progress');

        const progressItemHTML = `
            <div class="stories-fs__progress-item">
                <div class="stories-fs__progress-bg"></div>
            </div>`;

        for (let index = 0; index < slideInner.length; index++) {
            progressWrapper.insertAdjacentHTML('afterbegin', progressItemHTML);
        }

        const progressItems = element.querySelectorAll('.stories-fs__progress-item');

        progressItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                slideInner[activeIndex].classList.remove('active');
                slideInner[index].classList.add('active');
                activeIndex = index;
            })
        })

        autoPlay(slideInner);
        autoPlay(progressItems);

    });

    function autoPlay(elements: NodeListOf<Element>) {
        let activeIndex: number = 0;

        elements[activeIndex].classList.add('active');
        let timer = setInterval(() => {
            elements[activeIndex].classList.remove('active');
            activeIndex++;
            elements[activeIndex].classList.add('active');
            if (activeIndex == elements.length - 1) clearInterval(timer);
        }, speed);
    }

    function animationProgress() {

    }

}