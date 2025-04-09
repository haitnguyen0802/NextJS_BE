'use client';

import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import OrdersTable from './components/OrdersTable';
import styles from './orders.module.scss';

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statuses = ['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'];

  return (
    <DashboardLayout>
      <div className={styles.ordersPage}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Orders</h1>
            <button className={styles.exportButton}>
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className={styles.filters}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className={styles.searchIcon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className={styles.statusFilters}>
            {statuses.map((status) => (
              <button
                key={status}
                className={`${styles.statusButton} ${
                  statusFilter === status.toLowerCase() ? styles.active : ''
                }`}
                onClick={() => setStatusFilter(status.toLowerCase())}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className={styles.tableContainer}>
          <OrdersTable searchQuery={searchQuery} statusFilter={statusFilter} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage; 