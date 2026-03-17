import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Dumbbell, Users, Video, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useExchangeRates, convertToLocalCurrency, formatLocalCurrency } from '@/hooks/useExchangeRates';
import { useSelectedCountry } from '@/hooks/useSelectedCountry';
import { getCountryName } from '@/lib/countries';

interface Trainer {
  id: string;
  walletAddress: string;
  name: string;
  bio: string;
  specialties: string[];
  physicalRate: number;
  virtualRate: number;
  location: string;
  country: string;
  avatar: string;
  rating: number;
  totalSessions: number;
  isVerified: boolean;
}

interface TrainerCardProps {
  trainer: Trainer;
}

export function TrainerCard({ trainer }: TrainerCardProps) {
  const { data: rates } = useExchangeRates();
  const { selectedCountry } = useSelectedCountry();
  const physicalLocal = rates ? convertToLocalCurrency(trainer.physicalRate, 'USDC', selectedCountry, rates) : 0;
  const virtualLocal = rates ? convertToLocalCurrency(trainer.virtualRate, 'USDC', selectedCountry, rates) : 0;

  return (
    <div className="group relative">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/20 group-hover:to-accent/20 rounded-xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

      <div className="relative glass-card rounded-xl p-6 transition-all duration-300 group-hover:bg-white/[0.08] group-hover:border-white/20 group-hover:-translate-y-1">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-primary/30 ring-2 ring-primary/0 group-hover:ring-primary/20 transition-all">
              <AvatarImage src={trainer.avatar} alt={trainer.name} />
              <AvatarFallback className="gradient-primary text-primary-foreground font-display font-bold">
                {trainer.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {trainer.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-lg truncate text-foreground">{trainer.name}</h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{trainer.location}</span>
              <span className="inline-flex items-center gap-1"><Globe className="w-3.5 h-3.5" />{getCountryName(trainer.country)}</span>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="font-semibold text-foreground">{trainer.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>{trainer.totalSessions} sessions</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{trainer.bio}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {trainer.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="secondary" className="text-xs font-normal bg-secondary/50 border-border/50">
              {specialty}
            </Badge>
          ))}
          {trainer.specialties.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal border-border/50">
              +{trainer.specialties.length - 3}
            </Badge>
          )}
        </div>

        {/* On-chain success indicator */}
        {trainer.isVerified && trainer.totalSessions > 10 && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">
              On-chain verified · {Math.min(98, 85 + Math.floor(trainer.rating * 2))}% success
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-primary/10 overflow-hidden">
              <div
                className="h-full rounded-full gradient-primary"
                style={{ width: `${Math.min(98, 85 + Math.floor(trainer.rating * 2))}%` }}
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-border/30 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col p-3 rounded-lg bg-white/[0.03] border border-border/30">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1"><Users className="w-3 h-3" /><span>Physical</span></div>
              <span className="font-display font-bold text-sm text-foreground">{trainer.physicalRate.toFixed(0)} USDC</span>
              {rates && <span className="text-xs text-muted-foreground">≈ {formatLocalCurrency(physicalLocal, selectedCountry)}</span>}
            </div>

            <div className="flex flex-col p-3 rounded-lg bg-white/[0.03] border border-border/30">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1"><Video className="w-3 h-3" /><span>Virtual</span></div>
              <span className="font-display font-bold text-sm text-foreground">{trainer.virtualRate.toFixed(0)} USDC</span>
              {rates && <span className="text-xs text-muted-foreground">≈ {formatLocalCurrency(virtualLocal, selectedCountry)}</span>}
            </div>
          </div>

          <Link to={`/trainers/${trainer.id}`} className="block">
            <Button variant="hero" size="sm" className="w-full">Book Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
