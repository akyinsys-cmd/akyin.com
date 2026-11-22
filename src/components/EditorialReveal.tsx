import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface EditorialRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function EditorialReveal({
  children,
  className = '',
  delay = 0,
  y = 18,
}: EditorialRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some', margin: '0px 0px -36px 0px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
