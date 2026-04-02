import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPages = () => {
    const arr = [];
    for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) arr.push(i);
    return arr;
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPages().map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={clsx(
            'min-w-[2rem] h-8 rounded-lg border text-sm font-medium transition-colors',
            p === page
              ? 'bg-primary-600 text-white border-primary-600'
              : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
          )}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
