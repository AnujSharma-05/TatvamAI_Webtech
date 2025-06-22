"use client";
import { ReactNode, CSSProperties } from 'react';

interface MotionProviderProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function MotionProvider({ children, className = "", style }: MotionProviderProps) {
  return (
    <div className={`animate-fade-in ${className}`} style={style}>
      {children}
    </div>
  );
}

// Motion components for different animation types
export function MotionDiv({ children, className = "", delay = 0, style }: { children: ReactNode; className?: string; delay?: number; style?: CSSProperties }) {
  const delayClass = delay > 0 ? `animate-delay-${Math.min(delay, 500)}` : '';
  return (
    <div className={`animate-slide-up ${delayClass} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function MotionCard({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`animate-scale-up ${className}`} style={style}>
      {children}
    </div>
  );
}

export function MotionButton({ children, className = "", style, ...props }: { children: ReactNode; className?: string; style?: CSSProperties; [key: string]: any }) {
  return (
    <button className={`hover:scale-[1.03] transition-transform duration-300 ${className}`} style={style} {...props}>
      {children}
    </button>
  );
} 