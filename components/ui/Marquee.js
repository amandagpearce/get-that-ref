import React from 'react';
import styles from './Marquee.module.css';

const Marquee = ({ children }) => {
  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeContent}>
        <span>{children}</span>
        <span>{children}</span>
      </div>
    </div>
  );
};

export default Marquee;
