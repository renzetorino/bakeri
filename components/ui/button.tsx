import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 cursor-pointer rounded-sm text-sm text-primary-500 font-medium whitespace-nowrap disabled:pointer-events-none disabled:text-primary-300  [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 transition-opacity duration-200 ease-out",
  {
    variants: {
      variant: {
        default:
          'bg-primary-500 text-white shadow-sm hover:bg-primary-400 disabled:bg-primary-100',
        secondary:
          'bg-white border border-primary-500 hover:bg-primary-20 disabled:border-primary-200',
        destructive:
          'text-red-500 bg-red-500 hover:bg-red-400 disabled:bg-primary-100',
        secondaryDestructive:
          'bg-white border border-red-500 hover:bg-red-50 disabled:border-primary-200',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        calendar:
          'h-10 w-10 border-none hover:bg-primary-50 disabled:text-primary-200 disabled:bg-primary-50',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'py-[3px] px-2',
        md: 'py-1.5 px-4',
        lg: 'py-2.5 px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
