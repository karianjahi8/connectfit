import { countries, Country } from '@/lib/countries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function CountrySelect({ value, onChange, label = 'Country', className }: CountrySelectProps) {
  return (
    <div className={className}>
      {label && <Label className="mb-1 block">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <SelectValue placeholder="Select your country" />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
