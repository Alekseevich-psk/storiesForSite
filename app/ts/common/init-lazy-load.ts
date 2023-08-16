export default function lazyLoad(wrapper: Element) {
    const pictures = wrapper.querySelectorAll('.stories-fs__inner img');
    if (pictures.length <= 0) return;

    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(function (entry) {
            if (entry.intersectionRatio > 0 || entry.isIntersecting) {
                const image = entry.target as HTMLMediaElement;
                observer.unobserve(image);

                if (!image.hasAttribute('data-src')) return;

                const sourceUrl = image.getAttribute('data-src');
                image.setAttribute('src', sourceUrl);

                // image.onload = () => {
                // }

                // Removing the observer
                observer.unobserve(image);
            }
        });
    });

    pictures.forEach((el) => {
        observer.observe(el);
    });

}