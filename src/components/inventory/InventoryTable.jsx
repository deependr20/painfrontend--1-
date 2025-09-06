import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Edit, Trash2 } from 'lucide-react';

const InventoryTable = ({ products, isLowStock, onEditProduct, onDeleteProduct }) => {
  return (
    <Card className="glass-effect border-white/20">
      <CardHeader><CardTitle className="text-white">Product Inventory</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 text-white/90 font-semibold">Product Name</th>
                <th className="text-left py-3 px-4 text-white/90 font-semibold">Code</th>
                <th className="text-left py-3 px-4 text-white/90 font-semibold">Colour Base</th>
                <th className="text-left py-3 px-4 text-white/90 font-semibold">Company</th>
                <th className="text-left py-3 px-4 text-white/90 font-semibold">Qty (L)</th>
                <th className="text-left py-3 px-4 text-white/90 font-semibold">Qty (Units)</th>
                <th className="text-left py-3 px-4 text-white/90 font-semibold">Price</th>
                <th className="text-left py-3 px-4 text-white/90 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-8 text-white/70">No products found.</td></tr>
              ) : (
                products.map((product, index) => (
                  <motion.tr 
                    key={product.id || product.code} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: index * 0.05 }} 
                    className={`border-b border-white/10 hover:bg-white/5 transition-colors ${isLowStock(product.quantityUnits) ? 'bg-red-500/20' : ''}`}
                  >
                    <td className="py-3 px-4 text-white">{product.name}</td>
                    <td className="py-3 px-4 text-white/80">{product.code}</td>
                    <td className="py-3 px-4 text-white/80">{product.colourBase || 'N/A'}</td>
                    <td className="py-3 px-4 text-white/80">{product.company || 'N/A'}</td>
                    <td className="py-3 px-4 text-white/80">{product.quantityLiters}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${isLowStock(product.quantityUnits) ? 'text-red-400' : 'text-white'}`}>
                        {product.quantityUnits}
                        {isLowStock(product.quantityUnits) && (<AlertTriangle className="inline h-4 w-4 ml-1" />)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-green-400 font-semibold">₹{(product.price || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => onEditProduct(product)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 p-1"><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => onDeleteProduct(product.id || product.code)} className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-1"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryTable;