

// upload photo
let tag_img = document.querySelector('#post_tag');
let post_img = document.querySelector('#all_post');
let tag_b = document.querySelector('#p_t');
let photo_b = document.querySelector('#p_p');


photo_b.addEventListener('click', () => {
    tag_img.style.left = '100%';

    post_img.style.opacity = '1';
    tag_img.style.opacity = '0';

    post_img.style.left = '0';

    photo_b.style.borderBottom = '5px inset black';
    photo_b.style.borderBottom = 'none';
});

tag_b.addEventListener('click', () => {
    tag_img.style.left = '0%';

    post_img.style.left = '-100%';

    post_img.style.opacity = '0';
    tag_img.style.opacity = '1';

    tag_b.style.borderBottom = '5px inset black';
    tag_b.style.borderBottom = 'none';
});
