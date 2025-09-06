import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { ShoppingCart, Plus, Minus, Trash2, User, Phone, Search, Palette, X } from 'lucide-react';

const SellProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerData, setCustomerData] = useState({
    name: '',
    mobile: '',
    colorCode: '',
    colorCodes: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (productSearch) {
      const filtered = allProducts.filter(p =>
        (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
         p.code.toLowerCase().includes(productSearch.toLowerCase())) &&
        p.quantityUnits > 0
      );
      setSearchedProducts(filtered);
    } else {
      setSearchedProducts([]);
    }
  }, [productSearch, allProducts]);

  const loadProducts = () => {
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setAllProducts(savedProducts);
  };

  const addProductToSale = (product) => {
    if (!product) return;
    setProductSearch('');

    const existingItem = selectedProducts.find(item => item.productId === product.id);
    
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setSelectedProducts(prev => [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          productCode: product.code,
          colourBase: product.colourBase,
          company: product.company,
          quantityLiters: product.quantityLiters,
          price: product.price || 0,
          quantity: 1,
          maxQuantity: product.quantityUnits
        }
      ]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = allProducts.find(p => p.id === productId);
    
    if (newQuantity > product.quantityUnits) {
      toast({ title: "Insufficient stock", description: `Only ${product.quantityUnits} units available`, variant: "destructive" });
      return;
    }

    if (newQuantity <= 0) {
      removeProductFromSale(productId);
      return;
    }

    setSelectedProducts(prev =>
      prev.map(item => item.productId === productId ? { ...item, quantity: newQuantity } : item)
    );
  };
  
  const updatePrice = (productId, newPrice) => {
    setSelectedProducts(prev =>
      prev.map(item => item.productId === productId ? { ...item, price: parseFloat(newPrice) || 0 } : item)
    );
  };

  const removeProductFromSale = (productId) => {
    setSelectedProducts(prev => prev.filter(item => item.productId !== productId));
  };

  const handleAddColorCode = () => {
    if (customerData.colorCode.trim() === '') return;
    setCustomerData(prev => ({ ...prev, colorCodes: [...prev.colorCodes, prev.colorCode.trim()], colorCode: '' }));
  };

  const handleRemoveColorCode = (codeToRemove) => {
    setCustomerData(prev => ({ ...prev, colorCodes: prev.colorCodes.filter(code => code !== codeToRemove) }));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSale = async (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0) { toast({ title: "No products selected", variant: "destructive" }); return; }
    if (!customerData.name || !customerData.mobile) { toast({ title: "Customer information required", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const updatedProducts = allProducts.map(p => {
        const soldItem = selectedProducts.find(item => item.productId === p.id);
        return soldItem ? { ...p, quantityUnits: p.quantityUnits - soldItem.quantity } : p;
      });
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      const sales = JSON.parse(localStorage.getItem('sales') || '[]');
      const newSale = {
        id: Date.now().toString(),
        customerName: customerData.name,
        customerMobile: customerData.mobile,
        colorCodes: customerData.colorCodes,
        products: selectedProducts,
        totalPrice: calculateTotal(),
        saleDate: new Date().toISOString()
      };
      sales.push(newSale);
      localStorage.setItem('sales', JSON.stringify(sales));

      const customers = JSON.parse(localStorage.getItem('customers') || '[]');
      let customer = customers.find(c => c.mobile === customerData.mobile);
      if (customer) { customer.purchases.push({ saleId: newSale.id, ...newSale }); } 
      else { customers.push({ id: Date.now().toString(), name: customerData.name, mobile: customerData.mobile, purchases: [{ saleId: newSale.id, ...newSale }] }); }
      localStorage.setItem('customers', JSON.stringify(customers));
      toast({ title: "Sale completed successfully!", description: `Total: ₹${calculateTotal().toFixed(2)}` });
      setSelectedProducts([]);
      setCustomerData({ name: '', mobile: '', colorCode: '', colorCodes: [] });
      loadProducts();
    } catch (error) {
      toast({ title: "Error processing sale", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Sell Products">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader><CardTitle className="text-white">Select Products</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input placeholder="Search product by name or code..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="pl-10 glass-effect border-white/20 text-white placeholder:text-white/50"/>
                </div>
                {searchedProducts.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute z-10 w-full mt-1 bg-gray-800/80 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchedProducts.map(p => (<div key={p.id} onClick={() => addProductToSale(p)} className="p-3 hover:bg-white/10 cursor-pointer text-white"><p className="font-semibold">{p.name} ({p.code})</p><p className="text-sm text-white/70">{p.quantityUnits} units available</p></div>))}
                  </motion.div>
                )}
                <div className="space-y-3 pt-4">
                  {selectedProducts.map(item => (
                    <motion.div key={item.productId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 glass-effect rounded-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <div className="flex-1"><h4 className="text-white font-medium">{item.productName}</h4><p className="text-white/70 text-sm">{item.productCode} - {item.colourBase}</p></div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="border border-white/20 text-white hover:bg-white/10 hover:text-white"><Minus className="h-4 w-4" /></Button>
                          <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                          <Button size="sm" variant="ghost" onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="border border-white/20 text-white hover:bg-white/10 hover:text-white"><Plus className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => removeProductFromSale(item.productId)} className="text-red-400 hover:text-red-300 hover:bg-red-500/20"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center gap-2"><Label htmlFor={`price-${item.productId}`} className="text-white/90">Price (₹):</Label><Input id={`price-${item.productId}`} type="number" value={item.price} onChange={(e) => updatePrice(item.productId, e.target.value)} className="glass-effect border-white/20 text-white placeholder:text-white/50 w-24 h-8" /></div>
                        <span className="text-white font-semibold">Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          <Card className="glass-effect border-white/20">
            <CardHeader><CardTitle className="text-white flex items-center"><User className="h-5 w-5 mr-2" />Customer Information</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={e => e.preventDefault()} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="customerName" className="text-white/90">Customer Name</Label><Input id="customerName" placeholder="Enter customer name" value={customerData.name} onChange={e => setCustomerData(p => ({ ...p, name: e.target.value }))} required className="glass-effect border-white/20 text-white placeholder:text-white/50" /></div>
                <div className="space-y-2"><Label htmlFor="customerMobile" className="text-white/90">Mobile Number</Label><Input id="customerMobile" type="tel" placeholder="Enter mobile number" value={customerData.mobile} onChange={e => setCustomerData(p => ({ ...p, mobile: e.target.value }))} required className="glass-effect border-white/20 text-white placeholder:text-white/50" /></div>
                <div className="space-y-2">
                  <Label htmlFor="colorCode" className="text-white/90">Color Codes</Label>
                  <div className="flex gap-2"><Input id="colorCode" placeholder="Add a color code" value={customerData.colorCode} onChange={e => setCustomerData(p => ({ ...p, colorCode: e.target.value }))} className="glass-effect border-white/20 text-white placeholder:text-white/50" /><Button type="button" onClick={handleAddColorCode} className="bg-blue-600 hover:bg-blue-700 text-white">Add</Button></div>
                  <div className="flex flex-wrap gap-2 mt-2">{customerData.colorCodes.map((code, i) => (<div key={i} className="flex items-center gap-1 bg-white/20 text-white text-xs rounded-full px-2 py-1">{code}<button onClick={() => handleRemoveColorCode(code)}><X className="h-3 w-3" /></button></div>))}</div>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card className="glass-effect border-white/20">
            <CardHeader><CardTitle className="text-white flex items-center"><ShoppingCart className="h-5 w-5 mr-2" />Sale Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-white/80"><span>Items:</span><span>{selectedProducts.reduce((s, i) => s + i.quantity, 0)}</span></div>
                <div className="flex justify-between text-white/80"><span>Products:</span><span>{selectedProducts.length}</span></div>
                <div className="border-t border-white/20 pt-4"><div className="flex justify-between text-xl font-bold text-white"><span>Total:</span><span>₹{calculateTotal().toFixed(2)}</span></div></div>
                <Button onClick={handleSale} disabled={loading || selectedProducts.length === 0} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold">{loading ? 'Processing...' : 'Complete Sale'}</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SellProduct;