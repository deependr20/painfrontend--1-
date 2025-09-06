import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Package, 
  Plus, 
  ShoppingCart, 
  Users, 
  AlertTriangle, 
  LogOut,
  Palette,
  BarChart3,
  SlidersHorizontal
} from 'lucide-react';

const Layout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/add-product', icon: Plus, label: 'Add Product' },
    { path: '/sell-product', icon: ShoppingCart, label: 'Sell Product' },
    { path: '/customer-data', icon: Users, label: 'Customer Data' },
    { path: '/low-stock', icon: AlertTriangle, label: 'Low Stock' },
    { path: '/settings', icon: SlidersHorizontal, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen pattern-bg">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-effect border-b border-white/20 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Paint Shop Pro</h1>
              <p className="text-sm text-white/70">Inventory Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-white/90 hidden sm:block">
              Welcome, {user?.name || 'User'}
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={logout}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        <motion.aside 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-64 glass-effect border-r border-white/20 min-h-[calc(100vh-80px)] p-4 hidden lg:block"
        >
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start text-left ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </motion.div>
              );
            })}
          </nav>
        </motion.aside>

        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title && (
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded"></div>
              </div>
            )}
            {children}
          </motion.div>
        </main>
      </div>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20 p-2"
      >
        <div className="flex justify-around">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center p-2 ${
                  isActive ? 'text-white' : 'text-white/60'
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Layout;