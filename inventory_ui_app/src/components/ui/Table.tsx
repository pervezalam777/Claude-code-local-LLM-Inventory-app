import React from 'react';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: React.ReactNode, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T) => string;
}

export const Table = <T,>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
  rowClassName,
}: TableProps<T>) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
                  ${column.align === 'center' ? 'text-center' : ''}
                  ${column.align === 'right' ? 'text-right' : ''}
                `}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${rowClassName?.(row)}`}
            >
              {columns.map((column, colIndex) => {
                const value = row[column.key];
                return (
                  <td
                    key={`${String(column.key)}-${colIndex}`}
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300
                      ${column.align === 'center' ? 'text-center' : ''}
                      ${column.align === 'right' ? 'text-right' : ''}
                    `}
                  >
                    {column.render ? column.render(value as React.ReactNode, row) : String(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.displayName = 'Table';
