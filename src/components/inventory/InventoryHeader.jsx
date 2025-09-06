import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Filter, Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const InventoryHeader = ({ searchTerm, onSearchTermChange, onImportClick, onExportClick, loading }) => {
  return (
    <Card className="glass-effect border-white/20">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search products by name, code, company, or base..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-10 glass-effect border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center">
            <Button onClick={onImportClick} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Importing...' : 'Import CSV'}
            </Button>
            <Button onClick={onExportClick} className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })} 
              variant="outline" 
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryHeader;