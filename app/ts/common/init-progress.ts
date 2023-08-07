export default function initProgress(elements: NodeListOf<Element>) {
    elements.forEach(element => {
        const elementWrapper = element.querySelector('.stories-fs__wrapper');
        const elementInner = element.querySelectorAll('.stories-fs__inner') as NodeListOf<Element>;

        const progressWrapperHTML = `<div class="stories-fs__progress"></div>`;
        elementWrapper.insertAdjacentHTML('afterbegin', progressWrapperHTML);
        
        const progressWrapper = element.querySelector('.stories-fs__progress');
        const progressItemHTML = `
            <div class="stories-fs__progress-item">
                <div class="stories-fs__progress-bg"></div>
            </div>`;

        for (let index = 0; index < elementInner.length; index++) {
            progressWrapper.insertAdjacentHTML('afterbegin', progressItemHTML);
        }
    });

    return true;

}