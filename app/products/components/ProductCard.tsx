import Image from 'next/image';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return styles.statusInStock;
      case 'Low Stock':
        return styles.statusLowStock;
      case 'Out of Stock':
        return styles.statusOutOfStock;
      default:
        return '';
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.category}>{product.category}</p>
        <div className={styles.details}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <span className={`${styles.status} ${getStatusColor(product.status)}`}>
            {product.status}
          </span>
        </div>
        <div className={styles.stock}>
          <span>Stock: {product.stock}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 