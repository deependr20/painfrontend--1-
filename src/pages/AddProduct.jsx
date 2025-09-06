import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Plus, Upload } from 'lucide-react';
import Papa from 'papaparse';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    colourBase: '',
    company: '',
    quantityLiters: '',
    quantityUnits: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const processImportedData = (data) => {
    const currentProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const productsMap = new Map(currentProducts.map(p => [p.code, p]));
    let updatedCount = 0;
    let importedCount = 0;
    let errorCount = 0;
    let skippedMissingCodeOrName = 0;

    data.forEach((row, index) => {
      const productCode = row['Code'] || row['code'];
      const productName = row['Product Name'] || row['name'] || row['Product_Name'];

      if (!productCode || !productName) {
        skippedMissingCodeOrName++;
        return;
      }
      
      const quantityUnitsToAdd = parseInt(row['Quantity (Units)'] || row['quantityUnits'] || row['Quantity_Units']) || 0;
      const quantityLitersToAdd = parseFloat(row['Quantity (L)'] || row['quantityLiters'] || row['Quantity_L']) || 0;
      const price = parseFloat(row['Price'] || row['price']) || 0;
      const colourBase = row['Colour Base'] || row['colourBase'] || row['Colour_Base'] || '';
      const company = row['Company'] || row['company'] || '';


      if (productsMap.has(productCode)) {
        const p = productsMap.get(productCode);
        p.quantityUnits += quantityUnitsToAdd;
        p.price = price || p.price; 
        p.name = productName || p.name;
        p.colourBase = colourBase || p.colourBase;
        p.company = company || p.company;
        updatedCount++;
      } else {
        const newProduct = {
          id: `${Date.now()}-${index}`,
          name: productName, 
          code: productCode,
          colourBase: colourBase,
          company: company,
          quantityLiters: quantityLitersToAdd,
          quantityUnits: quantityUnitsToAdd,
          price: price,
          createdAt: new Date().toISOString()
        };
        productsMap.set(newProduct.code, newProduct);
        importedCount++;
      }
    });

    localStorage.setItem('products', JSON.stringify(Array.from(productsMap.values())));
    let description = `${importedCount} new products imported, ${updatedCount} products updated.`;
    if (errorCount > 0) description += ` ${errorCount} rows had parsing errors.`;
    if (skippedMissingCodeOrName > 0) description += ` ${skippedMissingCodeOrName} rows skipped due to missing code or name.`;
    
    toast({
      title: "Import Complete",
      description: description,
    });
  };


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = ""; 

        if (results.errors.length) {
            let errorMsg = "Error parsing CSV. Please check file format.";
            if(results.errors[0] && results.errors[0].message) errorMsg = results.errors[0].message;
            toast({ title: "Import Failed", description: errorMsg, variant: "destructive" });
            return;
        }

        if (!results.data || results.data.length === 0) {
            toast({ title: "Empty File", description: "The CSV file is empty or has no data.", variant: "destructive" });
            return;
        }
        processImportedData(results.data);
      },
      error: (error) => {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast({ title: "Import Failed", description: `Could not read file: ${error.message}`, variant: "destructive" });
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const existingProductIndex = products.findIndex(p => p.code === formData.code);
      
      const quantityUnitsToAdd = parseInt(formData.quantityUnits) || 0;
      const quantityLitersToAdd = parseFloat(formData.quantityLiters) || 0;
      const price = parseFloat(formData.price || 0);

      if (existingProductIndex !== -1) {
        const p = products[existingProductIndex];
        p.quantityUnits += quantityUnitsToAdd;
        p.price = price || p.price;
        p.name = formData.name || p.name;
        p.colourBase = formData.colourBase || p.colourBase;
        p.company = formData.company || p.company;
        if (formData.quantityLiters && p.quantityLiters === 0) {
            p.quantityLiters = quantityLitersToAdd;
        }


        toast({
          title: "Product Updated!",
          description: `Stock for ${p.name} has been updated.`,
        });
      } else {
        const newProduct = {
          id: Date.now().toString(),
          name: formData.name,
          code: formData.code,
          colourBase: formData.colourBase,
          company: formData.company,
          quantityLiters: quantityLitersToAdd,
          quantityUnits: quantityUnitsToAdd,
          price: price,
          createdAt: new Date().toISOString()
        };
        products.push(newProduct);
        toast({
          title: "Product Added!",
          description: `${formData.name} has been added to inventory.`,
        });
      }

      localStorage.setItem('products', JSON.stringify(products));
      setFormData({ name: '', code: '', colourBase: '', company: '', quantityLiters: '', quantityUnits: '', price: '' });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save product.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Layout title="Add/Update Product">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Plus className="h-6 w-6 mr-2" />
                Product Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" id="csv-importer" />
                <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 w-full" disabled={loading}>
                  <Upload className="h-4 w-4 mr-2" />
                  {loading ? 'Importing...' : 'Import Products from CSV'}
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/90">Product Name</Label>
                    <Input id="name" name="name" type="text" placeholder="Enter product name" value={formData.name} onChange={handleChange} required className="glass-effect border-white/20 text-white placeholder:text-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-white/90">Product Code</Label>
                    <Input id="code" name="code" type="text" placeholder="Enter unique product code" value={formData.code} onChange={handleChange} required className="glass-effect border-white/20 text-white placeholder:text-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="colourBase" className="text-white/90">Colour Base</Label>
                    <Input id="colourBase" name="colourBase" type="text" placeholder="e.g., White, Red, Blue" value={formData.colourBase} onChange={handleChange} required className="glass-effect border-white/20 text-white placeholder:text-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white/90">Company</Label>
                    <Input id="company" name="company" type="text" placeholder="Enter company name" value={formData.company} onChange={handleChange} required className="glass-effect border-white/20 text-white placeholder:text-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantityLiters" className="text-white/90">Quantity (Liters) <span className="text-xs text-white/60">(Only for new products)</span></Label>
                    <Input id="quantityLiters" name="quantityLiters" type="number" step="0.1" placeholder="Enter quantity in liters" value={formData.quantityLiters} onChange={handleChange} required className="glass-effect border-white/20 text-white placeholder:text-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantityUnits" className="text-white/90">Quantity to Add (Units)</Label>
                    <Input id="quantityUnits" name="quantityUnits" type="number" placeholder="Enter quantity in units" value={formData.quantityUnits} onChange={handleChange} required className="glass-effect border-white/20 text-white placeholder:text-white/50" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="price" className="text-white/90">Price per Unit (₹)</Label>
                    <Input id="price" name="price" type="number" step="0.01" placeholder="Enter price per unit" value={formData.price} onChange={handleChange} className="glass-effect border-white/20 text-white placeholder:text-white/50" />
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold">
                    {loading ? 'Saving...' : 'Save Product'}
                  </Button>
                  <Button type="button" onClick={() => setFormData({ name: '', code: '', colourBase: '', company: '', quantityLiters: '', quantityUnits: '', price: '' })} className="bg-gray-600 hover:bg-gray-700 text-white">
                    Clear Form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AddProduct;