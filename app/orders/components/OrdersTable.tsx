import { useState } from 'react';
import Image from 'next/image';
import styles from './OrdersTable.module.scss';

interface Order {
  id: string;
  customer: {
    name: string;
    image: string;
  };
  product: string;
  date: string;
  total: string;
  method: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
}

interface OrdersTableProps {
  searchQuery: string;
  statusFilter: string;
}

const OrdersTable = ({ searchQuery, statusFilter }: OrdersTableProps) => {
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Sample order data
  const orders: Order[] = [
    {
      id: 'ORD-1234',
      customer: {
        name: 'John Doe',
        image: '/users/user1.jpg',
      },
      product: 'iPhone 14 Pro Max',
      date: '24 Apr 2023',
      total: '$1,299.00',
      method: 'Credit Card',
      status: 'delivered',
    },
    {
      id: 'ORD-1235',
      customer: {
        name: 'Jane Smith',
        image: '/users/user2.jpg',
      },
      product: 'MacBook Pro M2',
      date: '25 Apr 2023',
      total: '$2,199.00',
      method: 'PayPal',
      status: 'processing',
    },
    {
      id: 'ORD-1236',
      customer: {
        name: 'Robert Johnson',
        image: '/users/user3.jpg',
      },
      product: 'AirPods Pro',
      date: '26 Apr 2023',
      total: '$249.00',
      method: 'Credit Card',
      status: 'pending',
    },
    {
      id: 'ORD-1237',
      customer: {
        name: 'Emily Wilson',
        image: '/users/user4.jpg',
      },
      product: 'iPad Pro 12.9"',
      date: '27 Apr 2023',
      total: '$1,099.00',
      method: 'Apple Pay',
      status: 'delivered',
    },
    {
      id: 'ORD-1238',
      customer: {
        name: 'Michael Brown',
        image: '/users/user5.jpg',
      },
      product: 'Apple Watch Series 8',
      date: '28 Apr 2023',
      total: '$399.00',
      method: 'Credit Card',
      status: 'cancelled',
    },
  ];

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;
    
    if (sortColumn === 'id') {
      comparison = a.id.localeCompare(b.id);
    } else if (sortColumn === 'customer') {
      comparison = a.customer.name.localeCompare(b.customer.name);
    } else if (sortColumn === 'product') {
      comparison = a.product.localeCompare(b.product);
    } else if (sortColumn === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortColumn === 'total') {
      comparison = parseFloat(a.total.replace('$', '').replace(',', '')) - 
                 parseFloat(b.total.replace('$', '').replace(',', ''));
    } else if (sortColumn === 'method') {
      comparison = a.method.localeCompare(b.method);
    } else if (sortColumn === 'status') {
      comparison = a.status.localeCompare(b.status);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'processing':
        return styles.statusProcessing;
      case 'delivered':
        return styles.statusDelivered;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return null;
    
    return (
      <span className={styles.sortIcon}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>
              Order ID <SortIcon column="id" />
            </th>
            <th onClick={() => handleSort('customer')}>
              Customer <SortIcon column="customer" />
            </th>
            <th onClick={() => handleSort('product')}>
              Product <SortIcon column="product" />
            </th>
            <th onClick={() => handleSort('date')}>
              Date <SortIcon column="date" />
            </th>
            <th onClick={() => handleSort('total')}>
              Total <SortIcon column="total" />
            </th>
            <th onClick={() => handleSort('method')}>
              Payment Method <SortIcon column="method" />
            </th>
            <th onClick={() => handleSort('status')}>
              Status <SortIcon column="status" />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                <div className={styles.customerCell}>
                  <div className={styles.avatar}>
                    <Image
                      src={order.customer.image}
                      alt={order.customer.name}
                      width={32}
                      height={32}
                      className={styles.avatarImage}
                    />
                  </div>
                  <span>{order.customer.name}</span>
                </div>
              </td>
              <td>{order.product}</td>
              <td>{order.date}</td>
              <td>{order.total}</td>
              <td>{order.method}</td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.actionButton} title="View details">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className={styles.actionButton} title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className={styles.actionButton} title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable; 