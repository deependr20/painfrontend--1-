import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, AlertTriangle } from 'lucide-react';

const InventoryStats = ({ products, isLowStock }) => {
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * p.quantityUnits, 0).toFixed(2);
  const lowStockItemsCount = products.filter(p => isLowStock(p.quantityUnits)).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="glass-effect border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="glass-effect border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-400">{lowStockItemsCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="glass-effect border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-green-400">₹{totalValue}</p>
            </div>
            <Package className="h-8 w-8 text-green-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryStats;