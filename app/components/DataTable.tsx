import Image from 'next/image';
import styles from './DataTable.module.scss'; // Import SCSS module

// Define an interface for the deal object for better type safety
interface Deal {
  id: number;
  product: {
    name: string;
    image: string;
  };
  location: string;
  date: string;
  pieces: string;
  amount: string;
  status: "Delivered" | "Pending" | "Processing"; // Use literal types for status
}

// Define props interface
interface DataTableProps {
  products?: {
    id: number;
    name: string;
    location: string;
    dateTime: string;
    pieces: number;
    amount: string;
    status: string;
    image: string;
  }[];
}

// Explicitly type the deals array with Deal[]
const defaultDeals: Deal[] = [
  {
    id: 1,
    product: {
      name: "Apple Watch",
      image: "/products/apple-watch.jpg" 
    },
    location: "6096 Marjolaine Landing",
    date: "12.09.2019 - 12.53 PM",
    pieces: "423",
    amount: "$34,295",
    status: "Delivered"
  },
  {
    id: 2,
    product: {
      name: "iPhone 14 Pro",
      image: "/products/iphone.jpg"
    },
    location: "2715 Westbrook Drive",
    date: "12.09.2019 - 11.30 AM",
    pieces: "235",
    amount: "$28,450",
    status: "Pending"
  },
  {
    id: 3,
    product: {
      name: "MacBook Pro",
      image: "/products/macbook.jpg"
    },
    location: "8385 Sundown Lane",
    date: "12.09.2019 - 10.15 AM",
    pieces: "156",
    amount: "$42,800",
    status: "Processing"
  },
  {
    id: 4,
    product: {
      name: "AirPods Pro",
      image: "/products/airpods.jpg"
    },
    location: "4932 Vernon Street",
    date: "12.09.2019 - 09.45 AM",
    pieces: "389",
    amount: "$12,650",
    status: "Delivered"
  }
];

const DataTable = ({ products }: DataTableProps) => {
  // Map products to deals if provided, otherwise use default deals
  const deals = products ? products.map(product => ({
    id: product.id,
    product: {
      name: product.name,
      image: product.image
    },
    location: product.location,
    date: product.dateTime,
    pieces: product.pieces.toString(),
    amount: product.amount,
    status: product.status as "Delivered" | "Pending" | "Processing"
  })) : defaultDeals;

  // Helper function to get status badge class
  const getStatusClass = (status: Deal['status']): string => {
    switch (status) {
      case "Delivered":
        return styles['statusBadge--delivered'];
      case "Pending":
        return styles['statusBadge--pending'];
      case "Processing":
        return styles['statusBadge--processing'];
      // No default needed due to exhaustive check by TypeScript with literal types
    }
  };

  return (
    <div className={styles.dataTableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Location</th>
            <th>Date - Time</th>
            <th>Piece</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* No need to type deal: Deal here anymore as deals is typed */} 
          {deals.map((deal) => (
            <tr key={deal.id}>
              <td>
                <div className={styles.productCell}>
                  <div className={styles.productCell__imageWrapper}>
                    <Image
                      src={deal.product.image}
                      alt={deal.product.name}
                      fill
                      sizes="40px" // Provide sizes hint for optimization
                    />
                  </div>
                  <span className={styles.productCell__name}>{deal.product.name}</span>
                </div>
              </td>
              <td>{deal.location}</td>
              <td>{deal.date}</td>
              <td>{deal.pieces}</td>
              <td>{deal.amount}</td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusClass(deal.status)}`}>
                  {deal.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 