import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Dumbbell, Users, Video, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useExchangeRates, formatUSD, convertToUSD } from '@/hooks/useExchangeRates';
import { getDirectionsUrl } from '@/components/maps/LocationMap';

interface Trainer {
  id: string;
  walletAddress: string;
  name: string;
  bio: string;
  specialties: string[];
  physicalRate: number;
  virtualRate: number;
  location: string;
  country?: string;
  avatar: string;
  rating: number;
  totalSessions: number;
  isVerified: boolean;
  lat?: number;
  lng?: number;
}

interface TrainerCardProps {
  trainer: Trainer;
}

export function TrainerCard({ trainer }: TrainerCardProps) {
  const { data: rates } = useExchangeRates();
  const physicalUsd = rates ? convertToUSD(trainer.physicalRate, 'AVAX', rates) : 0;
  const virtualUsd = rates ? convertToUSD(trainer.virtualRate, 'AVAX', rates) : 0;

  return (
    <Card className="group h-full gradient-card border-border/50 hover:shadow-medium hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            <AvatarImage src={trainer.avatar} alt={trainer.name} />
            <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
              {trainer.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-lg truncate">{trainer.name}</h3>
              {trainer.isVerified && <CheckCircle className="w-4 h-4 text-success shrink-0" />}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{trainer.location}</span>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="font-medium">{trainer.rating}</span>
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
            <Badge key={specialty} variant="secondary" className="text-xs font-normal">{specialty}</Badge>
          ))}
          {trainer.specialties.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal">+{trainer.specialties.length - 3}</Badge>
          )}
        </div>

        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col p-2 rounded-lg bg-muted/30">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Users className="w-3 h-3" /><span>Physical</span>
              </div>
              <span className="font-display font-bold text-sm">{trainer.physicalRate} AVAX</span>
              {rates && <span className="text-xs text-muted-foreground">≈ {formatUSD(physicalUsd)}</span>}
            </div>
            <div className="flex flex-col p-2 rounded-lg bg-muted/30">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Video className="w-3 h-3" /><span>Virtual</span>
              </div>
              <span className="font-display font-bold text-sm">{trainer.virtualRate} AVAX</span>
              {rates && <span className="text-xs text-muted-foreground">≈ {formatUSD(virtualUsd)}</span>}
            </div>
          </div>

          <div className="flex gap-2">
            <Link to={`/trainers/${trainer.id}`} className="flex-1">
              <Button variant="hero" size="sm" className="w-full">Book Now</Button>
            </Link>
            {trainer.lat && trainer.lng && (
              <a href={getDirectionsUrl(trainer.lat, trainer.lng)} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1">
                  <Navigation className="w-3.5 h-3.5" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
