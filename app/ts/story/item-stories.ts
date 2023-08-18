
export default function itemStories(wrapper: Element, elements: NodeListOf<Element>) {

    let pictureItems: NodeListOf<Element>;
    let storiesProgressItems: NodeListOf<Element>;
    let index = 0;

    elements.forEach((elements, activeIndex) => {
        const storiesProgressItem = elements.querySelectorAll('.stories-fs__progress-item');

        storiesProgressItem.forEach((subElement, activeItem) => {
            subElement.addEventListener('click', () => {
                createEventClickItem(activeIndex, activeItem);
            });
        })
    });

    function createEventClickItem(activeIndex: number, activeItem: number) {
        wrapper.dispatchEvent(new CustomEvent("clickItem", {
            detail: { activeIndex: activeIndex, activeItem: activeItem }
        }));
    }

}