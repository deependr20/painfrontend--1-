import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { toast } from '@/components/ui/use-toast';
import Papa from 'papaparse';
import InventoryHeader from '@/components/inventory/InventoryHeader';
import InventoryStats from '@/components/inventory/InventoryStats';
import InventoryTable from '@/components/inventory/InventoryTable';
import EditProductDialog from '@/components/inventory/EditProductDialog';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(3);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    loadProducts();
    const threshold = localStorage.getItem('lowStockThreshold');
    if (threshold) {
      setLowStockThreshold(parseInt(threshold));
    }
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const loadProducts = () => {
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(savedProducts);
  };

  const filterProducts = () => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.company && product.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.colourBase && product.colourBase.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredProducts(filtered);
  };
  
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
    
    const updatedProductList = Array.from(productsMap.values());
    localStorage.setItem('products', JSON.stringify(updatedProductList));
    setProducts(updatedProductList);

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
            let errorMsg = "Error parsing CSV. Please check file format and ensure 'Code' and 'Product Name' columns exist.";
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

  const exportToCSV = () => {
    const headers = ['Product Name', 'Code', 'Colour Base', 'Company', 'Quantity (L)', 'Quantity (Units)', 'Price'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => [
        `"${product.name.replace(/"/g, '""')}"`,
        product.code,
        `"${(product.colourBase || '').replace(/"/g, '""')}"`,
        `"${(product.company || '').replace(/"/g, '""')}"`,
        product.quantityLiters,
        product.quantityUnits,
        product.price || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful!",
      description: "Inventory data exported to CSV file.",
    });
  };

  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    toast({ title: "Product deleted", description: "Product has been removed from inventory." });
  };

  const isLowStock = (quantity) => quantity < lowStockThreshold;

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditFormData({ ...product });
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? { ...p, ...editFormData, price: parseFloat(editFormData.price) || 0, quantityLiters: parseFloat(editFormData.quantityLiters) || 0, quantityUnits: parseInt(editFormData.quantityUnits) || 0 } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setEditingProduct(null);
    toast({ title: "Product Updated", description: `${editFormData.name} has been updated.` });
  };

  const handleEditFormChange = (e) => {
    setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Layout title="Inventory Management">
      <div className="space-y-6">
        <InventoryHeader
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onImportClick={() => fileInputRef.current?.click()}
          onExportClick={exportToCSV}
          loading={loading}
        />
        <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        
        <InventoryStats products={products} isLowStock={isLowStock} />

        <InventoryTable
          products={filteredProducts}
          isLowStock={isLowStock}
          onEditProduct={handleEditProduct}
          onDeleteProduct={deleteProduct}
        />
      </div>

      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          formData={editFormData}
          onFormChange={handleEditFormChange}
          onSave={handleSaveEdit}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </Layout>
  );
};

export default Inventory;