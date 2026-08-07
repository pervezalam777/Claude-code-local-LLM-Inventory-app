import { Link } from 'react-router-dom';

interface NavbarProps {
  title?: string;
  links?: Array<{ label: string; to: string }>;
}

export const Navbar = ({ title = 'Inventory', links = [] }: NavbarProps) => {
  return (
    <nav className="border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 sm:px-4">
      <div className="flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          {links.length > 0 && (
            <div className="flex space-x-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 block rounded p-2 text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
