
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ProductPerformance } from '../types/analytics';

interface TopProductsTableProps {
  products: ProductPerformance[];
  title?: string;
}

const TopProductsTable: React.FC<TopProductsTableProps> = ({ 
  products, 
  title = 'Top Performing Products' 
}) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Units Sold</TableHead>
              <TableHead className="text-right">Conversion</TableHead>
              <TableHead className="text-right">Views</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.product_id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 text-sm font-medium">
                      #{index + 1}
                    </div>
                    <div className="flex items-center gap-3">
                      {product.product_image && (
                        <img 
                          src={product.product_image}
                          alt={product.product_name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{product.product_name}</div>
                        <div className="text-sm text-gray-500">
                          {product.favorites > 0 && (
                            <Badge variant="outline" className="text-xs">
                              ❤️ {product.favorites}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(product.total_revenue)}
                </TableCell>
                <TableCell className="text-right">
                  {product.total_orders}
                </TableCell>
                <TableCell className="text-right">
                  {product.units_sold}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={product.conversion_rate > 5 ? "default" : "secondary"}>
                    {formatPercent(product.conversion_rate)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-gray-600">
                  {product.views.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopProductsTable;
