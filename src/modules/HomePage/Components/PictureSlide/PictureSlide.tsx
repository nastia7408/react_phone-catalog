import classNames from 'classnames';
import style from './PictureSlide.module.scss';
import { useEffect, useState } from 'react';

const BANNERS = [
  {
    desktop: 'img/banner.svg',
    mobile: 'img/banner-mobile.svg',
    alt: 'iPhone 14 Pro offer',
  },
  {
    desktop: 'img/banner-phones.png',
    alt: 'Phones offer',
  },
  {
    desktop: 'img/banner-tablets.png',
    alt: 'Tablets offer',
  },
  {
    desktop: 'img/banner-accessories.png',
    alt: 'Accessories offer',
  },
];

export const PictureSlide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % BANNERS.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={style.pictureSlide}>
      <h1 className={style.visuallyHidden}>Product Catalog</h1>
      <p className={classNames(style.title, 'h1')}>
        Welcome to Nice Gadgets store!
      </p>
      <div className={style.bannerBlock}>
        <button
          type="button"
          className={classNames(style['nav-btn'], style.prev)}
          onClick={handlePrev}
        >
          <img src="img/icons/arrowleft.svg" alt="Previous slide" />
        </button>

        <div className={style.bannerContent}>
          <picture>
            <source
              media="(max-width: 639px)"
              srcSet={BANNERS[currentIndex].mobile}
            />
            <img
              src={BANNERS[currentIndex].desktop}
              alt={BANNERS[currentIndex].alt}
              className={style['gadget-img']}
            />
          </picture>
        </div>

        <button
          type="button"
          className={classNames(style['nav-btn'], style.next)}
          onClick={handleNext}
        >
          <img src="img/icons/arrowright.svg" alt="img" />
        </button>
      </div>
      <div className={style.pagination}>
        {BANNERS.map((_, index) => (
          <button
            key={index}
            type="button"
            className={classNames(style['dot-element'], {
              [style.active]: index === currentIndex,
            })}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};
