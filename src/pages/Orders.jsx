import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../utils/motionVariants';
import { formatCurrency } from '../utils/currency';
import '../styles/pages.css';

export default function Orders() {
  const orders = [
    { id: "ORD-91823", date: "April 02, 2026", status: "In Transit", total: 125000 },
    { id: "ORD-94331", date: "Jan 14, 2026", status: "Delivered", total: 45000 },
  ];
  return (
    <motion.div className="orders-page" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ padding: '2rem 0' }}>
      <h1 className="page-title">My Architectures</h1>
      <div className="dashboard-card" style={{ padding: '1rem', overflowX: 'auto' }}>
         <table className="inventory-table" style={{ width: '100%' }}>
            <thead>
               <tr><th>Order Context ID</th><th>Date Initiated</th><th>Logistics Status</th><th style={{ textAlign: 'right' }}>Total Transacted</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                 <tr key={o.id}>
                    <td className="item-title" style={{ padding: '1.5rem 1rem' }}>{o.id}</td>
                    <td style={{ padding: '1.5rem 1rem' }}>{o.date}</td>
                    <td style={{ padding: '1.5rem 1rem' }}>
                       <span style={{ padding: '0.5rem 1rem', background: o.status === 'Delivered' ? 'var(--color-surface-container-low)' : 'rgba(25, 27, 35, 0.05)', borderRadius: 'var(--radius-xl)', fontSize: '0.85rem', fontWeight: 600 }}>{o.status}</span>
                    </td>
                    <td style={{ fontWeight: 600, textAlign: 'right', padding: '1.5rem 1rem' }}>{formatCurrency(o.total)}</td>
                 </tr>
              ))}
            </tbody>
         </table>
      </div>
    </motion.div>
  );
}
