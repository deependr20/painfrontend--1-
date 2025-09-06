import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { 
  AlertTriangle, 
  Settings, 
  Package, 
  RefreshCw,
  Bell
} from 'lucide-react';

const LowStockAlerts = () => {
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [threshold, setThreshold] = useState(3);
  const [newThreshold, setNewThreshold] = useState(3);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLowStockProducts();
  }, [products, threshold]);

  const loadData = () => {
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const savedThreshold = localStorage.getItem('lowStockThreshold');
    
    setProducts(savedProducts);
    
    if (savedThreshold) {
      const thresholdValue = parseInt(savedThreshold);
      setThreshold(thresholdValue);
      setNewThreshold(thresholdValue);
    }
  };

  const filterLowStockProducts = () => {
    const lowStock = products.filter(product => product.quantityUnits <= threshold);
    setLowStockProducts(lowStock);
  };

  const updateThreshold = () => {
    if (newThreshold < 0) {
      toast({
        title: "Invalid threshold",
        description: "Threshold must be a positive number",
        variant: "destructive",
      });
      return;
    }

    setThreshold(newThreshold);
    localStorage.setItem('lowStockThreshold', newThreshold.toString());
    
    toast({
      title: "Threshold updated!",
      description: `Low stock threshold set to ${newThreshold} units`,
    });
  };

  const refreshData = () => {
    loadData();
    toast({
      title: "Data refreshed!",
      description: "Product data has been updated",
    });
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { status: 'Out of Stock', color: 'text-red-500', bgColor: 'bg-red-500/20' };
    if (quantity <= threshold) return { status: 'Low Stock', color: 'text-orange-500', bgColor: 'bg-orange-500/20' };
    return { status: 'In Stock', color: 'text-green-500', bgColor: 'bg-green-500/20' };
  };

  return (
    <Layout title="Low Stock Alerts">
      <div className="space-y-6">
        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-effect border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Low Stock Items</p>
                  <p className="text-2xl font-bold text-red-400">{lowStockProducts.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-500">
                    {products.filter(p => p.quantityUnits === 0).length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Current Threshold</p>
                  <p className="text-2xl font-bold text-blue-400">{threshold}</p>
                </div>
                <Settings className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-white">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Threshold Settings */}
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 max-w-xs">
                <Label htmlFor="threshold" className="text-white/90">
                  Low Stock Threshold (units)
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  min="0"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(parseInt(e.target.value) || 0)}
                  className="glass-effect border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={updateThreshold}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Update Threshold
                </Button>
                <Button
                  onClick={refreshData}
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">All Good!</h3>
                <p className="text-white/70">No products are currently low on stock.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white/90 font-semibold">Product Name</th>
                      <th className="text-left py-3 px-4 text-white/90 font-semibold">Code</th>
                      <th className="text-left py-3 px-4 text-white/90 font-semibold">Company</th>
                      <th className="text-left py-3 px-4 text-white/90 font-semibold">Current Stock</th>
                      <th className="text-left py-3 px-4 text-white/90 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-white/90 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product, index) => {
                      const stockStatus = getStockStatus(product.quantityUnits);
                      
                      return (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 px-4 text-white">{product.name}</td>
                          <td className="py-3 px-4 text-white/80">{product.code}</td>
                          <td className="py-3 px-4 text-white/80">{product.company}</td>
                          <td className="py-3 px-4">
                            <span className={`font-semibold ${stockStatus.color}`}>
                              {product.quantityUnits} units
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.color}`}>
                              {stockStatus.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              onClick={() => toast({
                                title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                              })}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Reorder
                            </Button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LowStockAlerts;