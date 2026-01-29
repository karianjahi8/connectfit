import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

const specialties = [
  'Strength Training',
  'HIIT',
  'Weight Loss',
  'Yoga',
  'Pilates',
  'Meditation',
  'Sports Performance',
  'Cardio',
  'Endurance',
  'Nutrition',
  'Lifestyle Coaching',
  'Bodybuilding',
  'CrossFit',
  'Boxing',
  'Swimming',
];

interface TrainerFiltersProps {
  selectedSpecialties: string[];
  onSpecialtiesChange: (specialties: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (verified: boolean) => void;
}

export function TrainerFilters({
  selectedSpecialties,
  onSpecialtiesChange,
  priceRange,
  onPriceRangeChange,
  verifiedOnly,
  onVerifiedOnlyChange,
}: TrainerFiltersProps) {
  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      onSpecialtiesChange(selectedSpecialties.filter((s) => s !== specialty));
    } else {
      onSpecialtiesChange([...selectedSpecialties, specialty]);
    }
  };

  return (
    <Card className="sticky top-24 gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="font-display text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Verified Only */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            <Label htmlFor="verified" className="font-medium">
              Verified Only
            </Label>
          </div>
          <Switch
            id="verified"
            checked={verifiedOnly}
            onCheckedChange={onVerifiedOnlyChange}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="font-medium">Price Range (AVAX/hr)</Label>
          <Slider
            value={[priceRange[1]]}
            onValueChange={([val]) => onPriceRangeChange([priceRange[0], val])}
            max={1}
            min={0}
            step={0.01}
            className="py-2"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>0 AVAX</span>
            <span className="font-medium text-foreground">
              Up to {priceRange[1]} AVAX
            </span>
          </div>
        </div>

        {/* Specialties */}
        <div className="space-y-3">
          <Label className="font-medium">Specialties</Label>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty) => {
              const isSelected = selectedSpecialties.includes(specialty);
              return (
                <Badge
                  key={specialty}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'gradient-primary text-primary-foreground'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => toggleSpecialty(specialty)}
                >
                  {specialty}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedSpecialties.length > 0 || verifiedOnly || priceRange[1] < 1) && (
          <button
            onClick={() => {
              onSpecialtiesChange([]);
              onVerifiedOnlyChange(false);
              onPriceRangeChange([0, 1]);
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
