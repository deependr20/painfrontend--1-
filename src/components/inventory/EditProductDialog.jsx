import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const EditProductDialog = ({ product, formData, onFormChange, onSave, onClose }) => {
  if (!product) return null;

  return (
    <AlertDialog open={!!product} onOpenChange={onClose}>
      <AlertDialogContent className="glass-effect text-white border-white/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Edit Product: {product.name}</AlertDialogTitle>
          <AlertDialogDescription className="text-white/80">
            Modify the details of the product below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name" className="text-white/90">Product Name</Label>
              <Input id="edit-name" name="name" value={formData.name || ''} onChange={onFormChange} className="glass-effect border-white/20 text-white placeholder:text-white/50" />
            </div>
            <div>
              <Label htmlFor="edit-code" className="text-white/90">Product Code</Label>
              <Input id="edit-code" name="code" value={formData.code || ''} onChange={onFormChange} disabled className="glass-effect border-white/20 text-white placeholder:text-white/50 opacity-70" />
            </div>
            <div>
              <Label htmlFor="edit-colourBase" className="text-white/90">Colour Base</Label>
              <Input id="edit-colourBase" name="colourBase" value={formData.colourBase || ''} onChange={onFormChange} className="glass-effect border-white/20 text-white placeholder:text-white/50" />
            </div>
            <div>
              <Label htmlFor="edit-company" className="text-white/90">Company</Label>
              <Input id="edit-company" name="company" value={formData.company || ''} onChange={onFormChange} className="glass-effect border-white/20 text-white placeholder:text-white/50" />
            </div>
            <div>
              <Label htmlFor="edit-quantityLiters" className="text-white/90">Quantity (Liters)</Label>
              <Input id="edit-quantityLiters" name="quantityLiters" type="number" step="0.1" value={formData.quantityLiters || ''} onChange={onFormChange} className="glass-effect border-white/20 text-white placeholder:text-white/50" />
            </div>
            <div>
              <Label htmlFor="edit-quantityUnits" className="text-white/90">Quantity (Units)</Label>
              <Input id="edit-quantityUnits" name="quantityUnits" type="number" value={formData.quantityUnits || ''} onChange={onFormChange} className="glass-effect border-white/20 text-white placeholder:text-white/50" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="edit-price" className="text-white/90">Price (₹)</Label>
              <Input id="edit-price" name="price" type="number" step="0.01" value={formData.price || ''} onChange={onFormChange} className="glass-effect border-white/20 text-white placeholder:text-white/50" />
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="bg-transparent text-white hover:bg-white/10 border-white/20">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditProductDialog;