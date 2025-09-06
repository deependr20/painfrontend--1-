import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { 
  Search, 
  Download, 
  Users, 
  Phone, 
  ShoppingBag,
  Palette,
  Package,
  Calendar
} from 'lucide-react';

const CustomerData = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSales();
  }, []);

  useEffect(() => {
    filterSales();
  }, [sales, searchTerm]);

  const loadSales = () => {
    const savedSales = JSON.parse(localStorage.getItem('sales') || '[]');
    setSales(savedSales.flatMap(sale => 
      sale.products.map(product => ({
        ...sale,
        ...product,
        saleId: sale.id,
        productId: product.productId
      }))
    ));
  };

  const filterSales = () => {
    let filtered = sales;
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerMobile.includes(searchTerm) ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredSales(filtered);
  };

  const exportToCSV = () => {
    const headers = [
        'Customer Name', 'Mobile Number', 'Sale Date', 'Product Name', 'Product Code', 
        'Colour Base', 'Company', 'Qty (L)', 'Qty Purchased', 'Color Codes', 'Price'
    ];
    const csvContent = [
      headers.join(','),
      ...filteredSales.map(item => [
        item.customerName,
        item.customerMobile,
        new Date(item.saleDate).toLocaleDateString(),
        item.productName,
        item.productCode,
        item.colourBase,
        item.company,
        item.quantityLiters,
        item.quantity,
        `"${(item.colorCodes || []).join(', ')}"`,
        item.price
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful!",
      description: "Sales data exported to CSV file.",
    });
  };

  return (
    <Layout title="Customer Purchase Data">
      <div className="space-y-6">
        <Card className="glass-effect border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search by customer, product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-effect border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <Button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Sales History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">Customer</th>
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">Product</th>
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">Details</th>
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">Qty</th>
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">Color Codes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-white/70">
                        No sales data found.
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((item, index) => (
                      <motion.tr
                        key={`${item.saleId}-${item.productId}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4 text-white">
                          <div className="font-medium">{item.customerName}</div>
                          <div className="text-sm text-white/70 flex items-center gap-1"><Phone className="h-3 w-3"/>{item.customerMobile}</div>
                          <div className="text-xs text-white/50 flex items-center gap-1"><Calendar className="h-3 w-3"/>{new Date(item.saleDate).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3 px-4 text-white">
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-white/70">{item.productCode}</div>
                        </td>
                        <td className="py-3 px-4 text-white/80">
                          <div className="flex items-center gap-1"><Palette className="h-4 w-4"/>{item.colourBase}</div>
                          <div className="flex items-center gap-1"><Users className="h-4 w-4"/>{item.company}</div>
                        </td>
                         <td className="py-3 px-4 text-white/80">
                          <div>{item.quantity} units</div>
                          <div className="text-sm">{item.quantityLiters} L</div>
                        </td>
                        <td className="py-3 px-4 text-green-400 font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-white/80 text-sm">
                           {(item.colorCodes && item.colorCodes.length > 0) ? item.colorCodes.join(', ') : 'N/A'}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerData;