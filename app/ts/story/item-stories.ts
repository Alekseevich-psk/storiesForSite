import { Options } from "../types/options";

export default function itemStories(elements: NodeListOf<Element>, activeSlideIndex: number, options: Options) {

    let pictureItems: NodeListOf<Element>;
    let storiesProgressItems: NodeListOf<Element>;
    let index = 0;

    elements.forEach(elements => {
        pictureItems = elements.querySelectorAll('.stories-fs__inner');
        storiesProgressItems = elements.querySelectorAll('.stories-fs__progress-item');

        storiesProgressItems.forEach(element => {
            console.log(element);
            
        })
    });



}