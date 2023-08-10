# Stories-FS

## Package that adds "instagram stories" to your site

With Stories-FS, you can create professional-quality visual content.

1. [**Demo page**](https://alekseevich-psk.github.io/storiesForSite/dist/)
2. [**How install?**](#how-install)
3. [**Example**](#example)
4. [**Parameters**](#parameters)

---

## How install?

1. npm i stories-fs
2. Add files: <br> HEAD - stories-fs-style.css <br>
   Scripts - stories-fs.js
3. Init

```js
new storiesFs(".stories-fs", {
    slidesPerView: {
        320: {
            count: 4,
        },
        960: {
            count: 6,
        },
        1280: {
            count: 12,
        },
    },
});
```

## Example HTML:

```html
<div class="stories-fs">
    <div class="stories-fs__wrapper">
        <div class="stories-fs__track">
            <div class="stories-fs__slide">
                <div class="stories-fs__preview">
                    <img src="./images/1.jpg" alt="" />
                </div>
                <div class="stories-fs__sub-wrapper">
                    <div class="stories-fs__inner">
                        <img src="./images/1.jpg" alt="" />
                    </div>
                    <div class="stories-fs__inner">
                        <img src="./images/2.jpg" alt="" />
                    </div>
                    <div class="stories-fs__inner">
                        <img src="./images/3.jpg" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

---

## Parameters

---

| Name                   |  type   | Default |           Value            | Description                                               |
| :--------------------- | :-----: | :-----: | :------------------------: | :-------------------------------------------------------- |
| **slidesPerView**      | object  |    -    |             -              | The number of slides at a given screen resolution         |
| **navigation**         | object  |  false  | elBtnPrev &#124; elBtnNext | Replacement of default slider control buttons             |
| **swipeOnSlide**       | boolean |  true   |     true &#124; false      | Add the ability to switch slides by swipe on the slide    |
| **speedStory**         | number  |  3000   |             -              | Viewing time of one story                                 |
| **speedAnimNextSlide** | number  |   32    |             -              | Speed animation next slide. low value = high speed scroll |
