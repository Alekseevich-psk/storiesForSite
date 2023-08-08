new storiesFs(".main__stories-fs", {
    navigation: {
        elBtnPrev: '.main__btn--prev',
        elBtnNext: '.main__btn--next',
    }, 
    slidesPerView: {
        320: {
            count: 2
        },
        960: {
            count: 2
        },
        1280: {
            count: 12
        }
    }
});
