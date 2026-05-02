import { clsx } from 'clsx';
import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, className, icon: Icon, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'input',
            Icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
