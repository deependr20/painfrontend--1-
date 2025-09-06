import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Settings = () => {
  const { logout } = useAuth();

  const handleClearData = () => {
    try {
      localStorage.removeItem('products');
      localStorage.removeItem('customers');
      localStorage.removeItem('sales');
      localStorage.removeItem('lowStockThreshold');
      localStorage.removeItem('users');
      
      toast({
        title: "Data Cleared",
        description: "All application data has been successfully cleared.",
      });

      logout();

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-effect border-white/20 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-white">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-red-500/50 bg-red-500/10 rounded-lg">
              <div>
                <h4 className="font-bold text-red-300">Clear All Data</h4>
                <p className="text-red-300/80 text-sm mt-1">
                  This action is irreversible. All products, customers, sales, and user accounts will be permanently deleted.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-effect text-white border-white/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center text-white">
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-white/80">
                      This action cannot be undone. This will permanently delete all data from the application, including products, sales, and customer records.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent text-white hover:bg-white/10 border-white/20">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Yes, delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default Settings;