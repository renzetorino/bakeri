import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import * as React from 'react';
interface InputProps extends React.ComponentProps<'input'> {
  label?: string;
  error?: string;
}

function Input({ className, type, label, error, ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1 text-sm">
      <Label className="text-primary-700">{label}</Label>
      <input
        type={type}
        data-slot="input"
        className={cn(
          'outline-primary-300 hover:outline-primary-500 h-10 w-full rounded-[4px] border px-4 outline-1 transition-colors',
          'focus:outline-primary-500 focus:outline-[1.5px]',
          'disabled:bg-primary-20 disabled:outline-primary-100 disabled:text-primary-200',
          error &&
            'outline-red-500 hover:outline-red-500 focus:outline-red-500',
          className,
        )}
        {...props}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export { Input };
