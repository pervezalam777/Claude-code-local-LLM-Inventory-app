import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from './Table';

interface TestData {
  id: number;
  name: string;
  email: string;
}

describe('Table', () => {
  const columns: Column[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
  ];

  const data: TestData[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  type Column = {
    key: keyof TestData;
    label: string;
    render?: (value: React.ReactNode, row: TestData) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
  };

  it('renders the table with columns and data', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('displays loading spinner when isLoading is true', () => {
    const { container } = render(<Table columns={columns} data={data} isLoading={true} />);
    const loader = container.querySelector('.flex.items-center.justify-center.py-12');
    expect(loader).toBeInTheDocument();
    expect(loader?.querySelector('.animate-spin.rounded-full.h-8.w-8.border-b-2.border-blue-600')).toBeInTheDocument();
  });

  it('shows empty message when data is empty', () => {
    const { container } = render(<Table columns={columns} data={[]} />);
    expect(container.querySelector('.text-center.py-12.px-4')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('uses custom empty message when provided', () => {
    const { container } = render(
      <Table columns={columns} data={[]} emptyMessage="No records found" />
    );
    expect(container.querySelector('.text-center.py-12.px-4')).toBeInTheDocument();
    expect(screen.getByText('No records found')).toBeInTheDocument();
  });

  it('applies custom className to the table container', () => {
    const { container } = render(<Table columns={columns} data={data} className="custom-table-class" />);
    const tableElement = container.querySelector('.overflow-x-auto');
    expect(tableElement).toBeInTheDocument();
    expect(tableElement?.querySelector('table')).toHaveClass('custom-table-class');
  });

  it('applies correct table class for grid styling', () => {
    render(<Table columns={columns} data={data} />);
    const tableElement = screen.getByRole('table');
    expect(tableElement).toHaveClass('min-w-full');
    expect(tableElement).toHaveClass('divide-y');
    expect(tableElement).toHaveClass('divide-gray-200');
  });

  it('aligns column headers based on align property', () => {
    const alignmentColumns: Column[] = [
      { key: 'id', label: 'ID', align: 'left' },
      { key: 'name', label: 'Name', align: 'center' },
      { key: 'email', label: 'Email', align: 'right' },
    ];
    render(<Table columns={alignmentColumns} data={data} />);
    const headers = screen.getAllByRole('columnheader');
    expect(headers[0]).toHaveClass('text-left');
    expect(headers[1]).toHaveClass('text-center');
    expect(headers[2]).toHaveClass('text-right');
  });

  it('aligns table cells based on align property', () => {
    const alignmentColumns: Column[] = [
      { key: 'id', label: 'ID', align: 'left' },
      { key: 'name', label: 'Name', align: 'center' },
      { key: 'email', label: 'Email', align: 'right' },
    ];
    const { container } = render(<Table columns={alignmentColumns} data={data} />);
    const cells = container.querySelectorAll('tbody td');
    // Left alignment doesn't add a class (default), center adds text-center
    expect(cells[1]).toHaveClass('text-center'); // Name cell 1
    expect(cells[2]).toHaveClass('text-right'); // Email cell 1
    expect(cells[4]).toHaveClass('text-center'); // Name cell 2
    expect(cells[5]).toHaveClass('text-right'); // Email cell 2
  });

  it('applies custom row className based on row data', () => {
    const rowClassColumns: Column[] = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
    ];
    const { container } = render(
      <Table
        columns={rowClassColumns}
        data={data}
        rowClassName={(row) => (row.id === 1 ? 'bg-red-50' : 'bg-blue-50')}
      />
    );
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveClass('hover:bg-gray-50', 'bg-red-50');
    expect(rows[1]).toHaveClass('hover:bg-gray-50', 'bg-blue-50');
  });

  it('uses custom render function for cell content', () => {
    const renderColumns: Column[] = [
      { key: 'id', label: 'ID' },
      {
        key: 'name',
        label: 'Name',
        render: (value, row) => <strong>{value} - ID: {row.id}</strong>,
      },
      { key: 'email', label: 'Email' },
    ];
    render(<Table columns={renderColumns} data={data} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/John Doe - ID: 1/i)).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('converts value to string when no render function is provided', () => {
    const numericData = [{ id: 123, count: 456 }];
    const numericColumns = [
      { key: 'id', label: 'ID' },
      { key: 'count', label: 'Count' },
    ];
    render(<Table columns={numericColumns} data={numericData} />);
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
  });

  it('handles empty data array correctly', () => {
    const { container } = render(<Table columns={columns} data={[]} />);
    expect(container.querySelector('.text-center.py-12.px-4')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('displays correct number of rows', () => {
    render(<Table columns={columns} data={data} />);
    const rows = screen.getAllByRole('row');
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3);
  });

  it('renders header with correct styling', () => {
    const { container } = render(<Table columns={columns} data={data} />);
    // Check by class name instead of querying thead directly
    expect(container.querySelector('.bg-gray-50')).toBeInTheDocument();

    const idHeader = screen.getByText('ID') as HTMLElement;
    expect(idHeader).toHaveClass('px-6');
    expect(idHeader).toHaveClass('py-3');
    expect(idHeader).toHaveClass('text-xs');
    expect(idHeader).toHaveClass('font-medium');
    expect(idHeader).toHaveClass('uppercase');
    expect(idHeader).toHaveClass('tracking-wider');
  });

  it('renders body cells with correct styling', () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const cell = container.querySelector('tbody td') as HTMLElement;
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveClass('px-6');
    expect(cell).toHaveClass('py-4');
    expect(cell).toHaveClass('whitespace-nowrap');
    expect(cell).toHaveClass('text-sm');
    expect(cell).toHaveClass('text-gray-700');
  });

  it('applies hover class to table rows', () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const dataRows = container.querySelectorAll('tbody tr');
    expect(dataRows[0]).toHaveClass('hover:bg-gray-50');
    expect(dataRows[1]).toHaveClass('hover:bg-gray-50');
  });
});
