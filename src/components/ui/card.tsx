import React from 'react';
import { cn } from './button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('rounded-xl border border-gray-200 bg-white shadow-sm', className)}
        {...props}
    >
        {children}
    </div>
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
        {children}
    </div>
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900', className)} {...props}>
        {children}
    </h3>
));
CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props}>
        {children}
    </div>
));
CardContent.displayName = 'CardContent';
