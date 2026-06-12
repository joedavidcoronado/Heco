import styles from './GlowButton.module.css';

export function GlowButton({ children, onClick, className = '', type = 'button' }) {
  return (
    <button 
      className={`${styles.glowOnHover} ${className}`} 
      type={type} 
      onClick={onClick}
    >
      {children}
    </button>
  );
}