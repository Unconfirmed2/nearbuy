
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileSpreadsheet, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';

interface AnalyticsExportProps {
  merchantId: string;
}

const AnalyticsExport: React.FC<AnalyticsExportProps> = ({ merchantId }) => {
  const [exportType, setExportType] = useState('csv');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedMetrics, setSelectedMetrics] = useState({
    sales: true,
    orders: true,
    products: true,
    customers: true,
    inventory: false,
    reviews: false
  });

  const exportFormats = [
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet },
    { value: 'excel', label: 'Excel', icon: FileSpreadsheet }
  ];

  const availableMetrics = [
    { key: 'sales', label: 'Sales & Revenue' },
    { key: 'orders', label: 'Order History' },
    { key: 'products', label: 'Product Performance' },
    { key: 'customers', label: 'Customer Analytics' },
    { key: 'inventory', label: 'Inventory Reports' },
    { key: 'reviews', label: 'Reviews & Ratings' }
  ];

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric as keyof typeof prev]
    }));
  };

  const handleExport = () => {
    const selectedCount = Object.values(selectedMetrics).filter(Boolean).length;
    if (selectedCount === 0) {
      toast.error('Please select at least one metric to export');
      return;
    }

    if (!dateRange?.from || !dateRange?.to) {
      toast.error('Please select a date range');
      return;
    }

    // Simulate export process
    toast.success(`Exporting ${selectedCount} metrics as ${exportType.toUpperCase()}...`);
    
    // TODO: Implement actual export functionality with real data
    setTimeout(() => {
      toast.success('Export completed! Download should start automatically.');
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Date Range</label>
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
          />
        </div>

        {/* Export Format */}
        <div>
          <label className="text-sm font-medium mb-2 block">Export Format</label>
          <Select value={exportType} onValueChange={setExportType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exportFormats.map(format => (
                <SelectItem key={format.value} value={format.value}>
                  <div className="flex items-center gap-2">
                    <format.icon className="w-4 h-4" />
                    {format.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Metrics Selection */}
        <div>
          <label className="text-sm font-medium mb-3 block">Select Metrics</label>
          <div className="space-y-3">
            {availableMetrics.map(metric => (
              <div key={metric.key} className="flex items-center space-x-2">
                <Checkbox
                  id={metric.key}
                  checked={selectedMetrics[metric.key as keyof typeof selectedMetrics]}
                  onCheckedChange={() => handleMetricToggle(metric.key)}
                />
                <label
                  htmlFor={metric.key}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {metric.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleExport} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Export Analytics
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnalyticsExport;
