import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function Card({ children, className = '', onClick, hover = false }) {
  const Comp = onClick ? motion.div : 'div';
  
  return (
    <Comp
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      whileHover={hover || onClick ? { y: -2, scale: 1.01 } : undefined}
      className={cn(
        'bg-tg-secondaryBg rounded-2xl p-4',
        onClick && 'cursor-pointer',
        'transition-all duration-200',
        className
      )}
    >
      {children}
    </Comp>
  );
}
