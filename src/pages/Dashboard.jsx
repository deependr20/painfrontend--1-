import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Plus, 
  ShoppingCart, 
  Users, 
  AlertTriangle,
  TrendingUp,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalCustomers: 0,
    totalSales: 0
  });

  useEffect(() => {
    // Calculate stats from localStorage
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    
    const lowStockThreshold = parseInt(localStorage.getItem('lowStockThreshold') || '3');
    const lowStockItems = products.filter(p => p.quantityUnits < lowStockThreshold).length;
    
    const totalSales = sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);

    setStats({
      totalProducts: products.length,
      lowStockItems,
      totalCustomers: customers.length,
      totalSales
    });
  }, []);

  const navigationCards = [
    {
      title: 'Sell Product',
      description: 'Process new sales and manage transactions',
      icon: ShoppingCart,
      path: '/sell-product',
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700'
    },
    {
      title: 'Add Product',
      description: 'Add new products to your inventory',
      icon: Plus,
      path: '/add-product',
      color: 'from-blue-500 to-cyan-600',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-700'
    },
    {
      title: 'Inventory',
      description: 'View and manage your product inventory',
      icon: Package,
      path: '/inventory',
      color: 'from-purple-500 to-violet-600',
      hoverColor: 'hover:from-purple-600 hover:to-violet-700'
    },
    {
      title: 'Customer Data',
      description: 'Manage customer information and history',
      icon: Users,
      path: '/customer-data',
      color: 'from-orange-500 to-red-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700'
    },
    {
      title: 'Low Stock Alerts',
      description: 'Monitor products running low on stock',
      icon: AlertTriangle,
      path: '/low-stock',
      color: 'from-red-500 to-pink-600',
      hoverColor: 'hover:from-red-600 hover:to-pink-700'
    }
  ];

  const statsCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Sales',
      value: `₹${stats.totalSales.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect border-white/20 card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className="glass-effect border-white/20 card-hover cursor-pointer group"
                    onClick={() => navigate(card.path)}
                  >
                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} ${card.hoverColor} flex items-center justify-center mb-4 transition-all duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-white group-hover:text-blue-200 transition-colors">
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/70 text-sm mb-4">{card.description}</p>
                      <Button 
                        variant="ghost" 
                        className="text-blue-300 hover:text-blue-200 hover:bg-white/10 p-0"
                      >
                        Get Started →
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {stats.totalProducts}
                  </div>
                  <p className="text-white/70">Products in Inventory</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {stats.totalCustomers}
                  </div>
                  <p className="text-white/70">Registered Customers</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    ₹{stats.totalSales.toFixed(0)}
                  </div>
                  <p className="text-white/70">Total Sales Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;