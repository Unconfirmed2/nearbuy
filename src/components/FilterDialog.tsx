import { Filter, DollarSign, Star, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  maxDistance: number;
  onDistanceChange: (distance: number) => void;
}

const FilterDialog = ({ isOpen, onClose, maxDistance, onDistanceChange }: FilterDialogProps) => {
  const categories = [
    { id: "electronics", label: "Electronics" },
    { id: "clothing", label: "Clothing" },
    { id: "furniture", label: "Furniture" },
    { id: "sports", label: "Sports & Outdoors" },
    { id: "accessories", label: "Accessories" },
    { id: "books", label: "Books" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Products</span>
          </DialogTitle>
          <DialogDescription>
            Filter products by category, price range, and distance to find exactly what you're looking for.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2 text-base font-medium">
              <DollarSign className="w-4 h-4" />
              <span>Price Range</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="min-price" className="text-sm text-gray-600">Min</Label>
                <input
                  id="min-price"
                  type="number"
                  placeholder="$0"
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <Label htmlFor="max-price" className="text-sm text-gray-600">Max</Label>
                <input
                  id="max-price"
                  type="number"
                  placeholder="$1000"
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2 text-base font-medium">
              <Package className="w-4 h-4" />
              <span>Categories</span>
            </Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox id={category.id} />
                  <Label htmlFor={category.id} className="text-sm text-gray-700">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Rating Filter */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2 text-base font-medium">
              <Star className="w-4 h-4" />
              <span>Minimum Rating</span>
            </Label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Star className="w-3 h-3" />
                  <span>{rating}+</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Clear All
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
