import { useEffect, useMemo, useState } from 'react';
import style from './ProductDetailsPage.module.scss';
import '../../style/GlobalStyle.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ProductDetails } from '../../interface/interface';
import { toggleFavorite } from '../../features/favoritesSlice';
import { addToCart } from '../../features/cartSlice';
import { ProductsSlider } from '../../app/ProductSlider/ProductSlider';
import classNames from 'classnames';
import { Loader } from '../../app/Loader/Loader';

export const ProductDetailsPage = () => {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { productId } = useParams<{ productId: string }>();
  const { category } = useParams<{ category: string }>();
  const favoriteItems = useAppSelector(state => state.favorites.items) || [];
  const cartItems = useAppSelector(state => state.cart.items) || [];

  const { items: globalProducts } = useAppSelector(state => state.products);

  const catalogProduct = globalProducts.find(item => item.itemId === productId);

  const isFavorite = favoriteItems.some(item => item.itemId === productId);

  const isInCart = cartItems.some(item => item.product.itemId === productId);

  useEffect(() => {
    if (!productId || !category) {
      return;
    }

    setLoading(true);
    setError(false);

    fetch(`${import.meta.env.BASE_URL}/api/${category}.json`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${category}.json`);
        }

        return res.json();
      })

      .then(async (data: ProductDetails[]) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        return data;
      })

      .then((data: ProductDetails[]) => {
        const foundProduct = data.find(item => item.id === productId);

        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(foundProduct.images[0] || '');
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [category, productId]);

  const recommendedProducts = useMemo(() => {
    const filtered = globalProducts.filter(
      item => item.category === category && item.itemId !== productId,
    );

    return [...filtered].sort(() => 0.5 - Math.random());
  }, [globalProducts, category, productId]);

  const handleColorChange = (newColor: string) => {
    if (!product || newColor === product.color) {
      return;
    }

    const newProductId = `${product.namespaceId}-${product.capacity.toLowerCase()}-${newColor.toLowerCase()}`;

    navigate(`/${category}/${newProductId}`);
  };

  const handleCapacityChange = (newCapacity: string) => {
    if (!product || newCapacity === product.capacity) {
      return;
    }

    const newProductId = `${product.namespaceId}-${newCapacity.toLowerCase()}-${product.color.toLowerCase()}`;

    navigate(`/${category}/${newProductId}`);
  };

  const handleFavoriteToggle = () => {
    if (catalogProduct) {
      dispatch(toggleFavorite(catalogProduct));
    }
  };

  const handleCartToggle = () => {
    if (catalogProduct) {
      dispatch(addToCart(catalogProduct));
    }
  };

  if (loading) {
    return (
      <div className="page container">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page container">
        <p className="h2">Product was not found</p>
      </div>
    );
  }

  const mainImage = selectedImage || product.images?.[0] || '';

  return (
    <div className="container">
      <div className={style['navigation-block']}>
        <Link to="/">
          <img src="img/icons/home.svg" alt="Home" />
        </Link>
        <img src="img/icons/arrowrightdark.svg" alt="" />
        <Link to={`/${product.category}`} className="title-navigation">
          {product.category}
        </Link>
        <img src="img/icons/arrowrightdark.svg" alt="" />
        <p className="title-navigation">{product.name}</p>
      </div>
      <div
        className={style['back-button']}
        onClick={() => navigate(-1)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src="img/icons/arrowleft.svg"
          alt="Back"
          className={style['back-arrow']}
        />
        <p className={classNames(style['back-title'], 'small-text')}>Back</p>
      </div>
      <p className={classNames(style['title-main'], 'h2')}>{product.name}</p>
      <div className={style['gadget-info-block']}>
        <div className={style['gadget-info-block-photo']}>
          <div className={style['left-data-photo']}>
            {product.images?.map((imgUrl: string) => (
              <div
                key={imgUrl}
                className={style['picture-box']}
                onClick={() => setSelectedImage(imgUrl)}
              >
                <img
                  className={style['small-picture']}
                  src={`${imgUrl}`}
                  alt={product.name}
                />
              </div>
            ))}
          </div>
          <div className={style['right-data-photo']}>
            <img
              className={style['big-picture']}
              src={`${mainImage}`}
              alt={product.name}
            />
          </div>
        </div>
        <div className={style['gadget-info-block-text']}>
          <div className={style['space-between-block']}>
            <p className={classNames(style.text, 'small-text')}>
              Available colors
            </p>
            <p className={classNames(style.text, 'small-text')}>
              ID: {catalogProduct?.id}
            </p>
          </div>
          <div className={style['gadget-info-block-text-color']}>
            <div className={style['colors-block']}>
              {product.colorsAvailable?.map((c: string) => (
                <div
                  key={c}
                  className={`${style.color} ${style[c]} ${c === product.color ? style.active : ''}`}
                  onClick={() => handleColorChange(c)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
            <p className={classNames(style.text, 'small-text')}>
              Select capacity
            </p>
            <div className={style['capacity-block']}>
              {product.capacityAvailable?.map((cap: string) => (
                <button
                  key={cap}
                  className={`${classNames(style.capacity, 'body-text')} ${cap === product.capacity ? style.active : ''}`}
                  onClick={() => handleCapacityChange(cap)}
                  style={{ cursor: 'pointer' }}
                >
                  {cap}
                </button>
              ))}
            </div>
            <div className={style['cart-block']}>
              <div className={style['cart-block-price']}>
                <p className={classNames(style.price, 'h2')}>
                  {product.priceDiscount}
                </p>
                <p className={classNames(style.sale, 'h3')}>
                  {product.priceRegular}
                </p>
              </div>
              <div className={style['buttons-block']}>
                <button
                  type="button"
                  className={`${style.button} ${isInCart ? style.active : ''}`}
                  onClick={handleCartToggle}
                >
                  {isInCart ? 'Added to cart' : 'Add to cart'}
                </button>
                <button
                  type="button"
                  className={`${style['favourites-buttons']} ${isFavorite ? style.active : ''}`}
                  onClick={handleFavoriteToggle}
                >
                  {isFavorite ? (
                    <img
                      src="img/icons/favouritesActive.svg"
                      alt="Active favourite"
                    />
                  ) : (
                    <img
                      src="img/icons/favourites.svg"
                      alt="Add to favourites"
                    />
                  )}
                </button>
              </div>
            </div>
            <div className={style['other-info-block']}>
              <div
                className={classNames(style['left-data-info'], 'small-text')}
              >
                <p className="body-text">Screen</p>
                <p className="body-text">Resolution</p>
                <p className="body-text">Processor</p>
                <p className="body-text">RAM</p>
              </div>
              <div
                className={classNames(style['right-data-info'], 'small-text')}
              >
                <p className="body-text">{product.screen}</p>
                <p className="body-text">{product.resolution}</p>
                <p className="body-text">{product.processor}</p>
                <p className="body-text">{product.ram}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={style['about-info-block']}>
        <div className={style['about-info-block-left']}>
          <p className={classNames(style.title1, 'h3')}>About</p>
          {product.description?.map(block => (
            <div key={block.title}>
              <p className={classNames(style.title2, 'h4')}>{block.title}</p>
              {block.text.map((paragraph, idx) => (
                <div key={idx} className={classNames(style.text, 'body-text')}>
                  {paragraph}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={style['about-info-block-right']}>
          <p className={classNames(style.title1, 'h3')}>Tech specs</p>
          <div className={style['other-info-block']}>
            <div className={style['left-data-info']}>
              <p className="body-text">Screen</p>
              <p className="body-text">Resolution</p>
              <p className="body-text">Processor</p>
              <p className="body-text">RAM</p>
              <p className="body-text">Camera</p>
              <p className="body-text">Zoom</p>
              <p className="body-text">Cell</p>
            </div>
            <div className={style['right-data-info']}>
              <p className="body-text">{product.screen}</p>
              <p className="body-text">{product.resolution}</p>
              <p className="body-text">{product.processor}</p>
              <p className="body-text">{product.ram}</p>
              <p className="body-text">{product.camera}</p>
              <p className="body-text">{product.zoom}</p>
              <p className="body-text">{product.cell?.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={style.recommended}>
        {recommendedProducts.length > 0 && (
          <ProductsSlider
            title="You may also like"
            products={recommendedProducts}
          />
        )}
      </div>
    </div>
  );
};
