import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

const categories = [
  { value: 'gym_wear', label: 'Gym Wear' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'supplements', label: 'Supplements' },
  { value: 'accessories', label: 'Accessories' },
];

interface MarketplaceFiltersProps {
  selectedCategories: string[];
  onCategoriesChange: (cats: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (v: boolean) => void;
}

export function MarketplaceFilters({
  selectedCategories,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  verifiedOnly,
  onVerifiedOnlyChange,
}: MarketplaceFiltersProps) {
  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== cat));
    } else {
      onCategoriesChange([...selectedCategories, cat]);
    }
  };

  return (
    <Card className="sticky top-24 gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            <Label htmlFor="verified-vendor" className="font-medium">Verified Vendors</Label>
          </div>
          <Switch id="verified-vendor" checked={verifiedOnly} onCheckedChange={onVerifiedOnlyChange} />
        </div>

        <div className="space-y-3">
          <Label className="font-medium">Max Price (AVAX)</Label>
          <Slider
            value={[priceRange[1]]}
            onValueChange={([val]) => onPriceRangeChange([priceRange[0], val])}
            max={10}
            min={0}
            step={0.1}
            className="py-2"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>0 AVAX</span>
            <span className="font-medium text-foreground">Up to {priceRange[1]} AVAX</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="font-medium">Categories</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map(({ value, label }) => {
              const isSelected = selectedCategories.includes(value);
              return (
                <Badge
                  key={value}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all ${isSelected ? 'gradient-primary text-primary-foreground' : 'hover:border-primary/50'}`}
                  onClick={() => toggleCategory(value)}
                >
                  {label}
                </Badge>
              );
            })}
          </div>
        </div>

        {(selectedCategories.length > 0 || verifiedOnly || priceRange[1] < 10) && (
          <button
            onClick={() => {
              onCategoriesChange([]);
              onVerifiedOnlyChange(false);
              onPriceRangeChange([0, 10]);
            }}
            className="text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        )}
      </CardContent>
    </Card>
  );
}
