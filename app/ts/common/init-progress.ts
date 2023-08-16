import { Options } from '../types/options';

export default function initProgress(elements: NodeListOf<Element>, options: Options) {
    elements.forEach(element => {
        const elementWrapper = element.querySelector('.stories-fs__sub-wrapper');
        const elementInner = element.querySelectorAll('.stories-fs__inner') as NodeListOf<Element>;
        console.log(options.storiesMode == false);
        
        const hideClass = (options.storiesMode == false) ? 'hide' : '';
        const progressWrapperHTML = `<div class="stories-fs__progress ${hideClass}"></div>`;
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