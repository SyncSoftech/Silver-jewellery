// components/AdminLayout.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      if (!token && !router.pathname.startsWith('/admin/login')) {
        router.push('/admin/login');
      } else if (token && router.pathname === '/admin/login') {
        router.push('/admin/dashboard');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();

    const handleRouteChange = () => checkAuth();
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (router.pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-indigo-700"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="mt-8">
          <NavItem href="/admin/dashboard" icon="📊" text="Dashboard" isOpen={isSidebarOpen} />
          <NavItem href="/admin/products" icon="🛍️" text="Products" isOpen={isSidebarOpen} />
          <NavItem href="/admin/orders" icon="📦" text="Orders" isOpen={isSidebarOpen} />
          <NavItem href="/admin/customers" icon="👥" text="Customers" isOpen={isSidebarOpen} />
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-4 text-gray-200 hover:bg-indigo-700 transition-colors"
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {router.pathname.split('/').pop().charAt(0).toUpperCase() + 
               router.pathname.split('/').pop().slice(1) || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                {localStorage.getItem('adminName')?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, text, isOpen }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href} passHref>
      <div className={`flex items-center p-4 ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700'} cursor-pointer`}>
        <span className="text-xl">{icon}</span>
        {isOpen && <span className="ml-3">{text}</span>}
      </div>
    </Link>
  );
}