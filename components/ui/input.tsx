import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import * as React from 'react';

type InputProps =
  | ({ type: 'textarea' } & React.ComponentProps<'textarea'> & {
        label?: string;
        error?: string;
      })
  | (React.ComponentProps<'input'> & {
      label?: string;
      error?: string;
    });

const sharedClassName = (error?: string, className?: string) =>
  cn(
    'outline-primary-300 hover:outline-primary-500 w-full rounded-[4px] border px-4 outline-1 transition-colors',
    'focus:outline-primary-500 focus:outline-[1.5px]',
    'disabled:bg-primary-20 disabled:outline-primary-100 disabled:text-primary-200',
    error && 'outline-red-500 hover:outline-red-500 focus:outline-red-500',
    className,
  );

function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1 text-sm">
      <Label className="text-primary-700">{label}</Label>
      {props.type === 'textarea' ? (
        <textarea
          data-slot="input"
          className={cn(sharedClassName(error, className), 'min-h-24 py-2 resize-none')}
          {...(props as React.ComponentProps<'textarea'>)}
        />
      ) : (
        <input
          data-slot="input"
          className={cn(sharedClassName(error, className), 'h-10')}
          {...(props as React.ComponentProps<'input'>)}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export { Input };
