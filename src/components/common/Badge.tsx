import React from 'react';
import { OrderStatus } from '@/types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'blue' | 'purple' | 'orange' | 'yellow' | 'green' | 'indigo' | 'red' | 'gray';
  status?: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  status,
  size = 'md',
  className = '',
}) => {
  let computedVariant = variant;
  let label = children;

  if (status) {
    switch (status) {
      case 'ORDER_PLACED':
        computedVariant = 'blue';
        label = label || 'New';
        break;
      case 'PICKUP_ASSIGNED':
      case 'PICKED_UP':
        computedVariant = 'purple';
        label = label || (status === 'PICKUP_ASSIGNED' ? 'Pickup Assigned' : 'Picked Up');
        break;
      case 'RECEIVED_AT_FACILITY':
      case 'WEIGHED_VERIFIED':
      case 'WASHING':
      case 'DRYING':
      case 'IRONING':
        computedVariant = 'orange';
        label = label || status.replace(/_/g, ' ');
        break;
      case 'QUALITY_CHECK':
        computedVariant = 'yellow';
        label = label || 'QC Check';
        break;
      case 'PACKED':
        computedVariant = 'green';
        label = label || 'Packed';
        break;
      case 'DELIVERY_ASSIGNED':
      case 'OUT_FOR_DELIVERY':
        computedVariant = 'indigo';
        label = label || (status === 'DELIVERY_ASSIGNED' ? 'Delivery Assigned' : 'Out for Delivery');
        break;
      case 'DELIVERED':
      case 'COMPLETED':
        computedVariant = 'green';
        label = label || (status === 'DELIVERED' ? 'Delivered' : 'Completed');
        break;
      case 'CANCELLED':
        computedVariant = 'red';
        label = label || 'Cancelled';
        break;
      default:
        computedVariant = 'gray';
    }
  }

  const variantStyles: Record<string, string> = {
    blue: 'bg-blue-50/90 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    purple: 'bg-purple-50/90 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    orange: 'bg-orange-50/90 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
    yellow: 'bg-amber-50/90 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    green: 'bg-emerald-50/90 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    indigo: 'bg-indigo-50/90 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    red: 'bg-red-50/90 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
    gray: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-[9px] py-[5px] text-[11px]',
    lg: 'px-3 py-1.5 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${variantStyles[computedVariant]} ${sizeStyles[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
};
