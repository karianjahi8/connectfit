import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Search,
  Wallet,
  ExternalLink,
  Building2,
  Dumbbell,
  CalendarDays,
} from 'lucide-react';
import { format } from 'date-fns';
import { useExchangeRates, formatKES, convertToKES } from '@/hooks/useExchangeRates';

// Mock data for fitness clubs
const mockClubs = [
  {
    id: '1',
    name: 'Nairobi Fitness Hub',
    description: 'Premier fitness facility with state-of-the-art equipment and expert trainers. We offer a wide range of classes from HIIT to yoga.',
    location: 'Westlands, Nairobi',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop',
    memberCount: 1250,
    walletAddress: '0xabcd1234567890abcdef1234567890abcdef1234',
    events: [
      {
        id: 'e1',
        title: 'CrossFit Championship',
        description: 'Annual CrossFit competition open to all fitness levels. Win prizes and meet fellow fitness enthusiasts!',
        date: '2026-02-15',
        time: '8:00 AM',
        price: 0.02,
        spots: 50,
        spotsRemaining: 23,
        category: 'Competition',
      },
      {
        id: 'e2',
        title: 'Yoga Sunrise Session',
        description: 'Start your day with a peaceful yoga session on our rooftop terrace.',
        date: '2026-02-10',
        time: '6:00 AM',
        price: 0.005,
        spots: 30,
        spotsRemaining: 12,
        category: 'Class',
      },
    ],
  },
  {
    id: '2',
    name: 'Mombasa Beach Gym',
    description: 'Oceanfront fitness center combining indoor training with beach workouts. Experience fitness with a view!',
    location: 'Nyali, Mombasa',
    avatar: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=300&fit=crop',
    memberCount: 820,
    walletAddress: '0xdef01234567890abcdef1234567890abcdef5678',
    events: [
      {
        id: 'e3',
        title: 'Beach Boot Camp',
        description: 'High-intensity beach workout with professional trainers. Get fit while enjoying the ocean breeze!',
        date: '2026-02-08',
        time: '6:30 AM',
        price: 0.015,
        spots: 40,
        spotsRemaining: 8,
        category: 'Boot Camp',
      },
    ],
  },
  {
    id: '3',
    name: 'Kisumu Wellness Center',
    description: 'Holistic fitness center focusing on both physical and mental wellness. Offering gym, pool, and spa services.',
    location: 'Milimani, Kisumu',
    avatar: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300&h=300&fit=crop',
    memberCount: 580,
    walletAddress: '0x9876543210abcdef1234567890abcdef12345678',
    events: [
      {
        id: 'e4',
        title: 'Marathon Training Program',
        description: '8-week marathon preparation program with experienced coaches.',
        date: '2026-02-20',
        time: '5:30 AM',
        price: 0.08,
        spots: 25,
        spotsRemaining: 15,
        category: 'Program',
      },
      {
        id: 'e5',
        title: 'Nutrition Workshop',
        description: 'Learn about sports nutrition and meal planning for optimal performance.',
        date: '2026-02-12',
        time: '10:00 AM',
        price: 0.01,
        spots: 35,
        spotsRemaining: 20,
        category: 'Workshop',
      },
    ],
  },
];

const categories = ['All', 'Competition', 'Class', 'Boot Camp', 'Program', 'Workshop'];

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: rates } = useExchangeRates();

  const filteredClubs = mockClubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Competition':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'Class':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'Boot Camp':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'Program':
        return 'bg-success/20 text-success border-success/30';
      case 'Workshop':
        return 'bg-accent/20 text-accent-foreground border-accent/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Fitness <span className="gradient-text">Clubs</span>
          </h1>
          <p className="text-muted-foreground">
            Discover fitness clubs and their upcoming events near you
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clubs or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${
                  selectedCategory === category
                    ? 'gradient-primary text-primary-foreground'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Clubs List */}
        <div className="space-y-8">
          {filteredClubs.map((club, clubIndex) => {
            const filteredEvents =
              selectedCategory === 'All'
                ? club.events
                : club.events.filter((e) => e.category === selectedCategory);

            if (selectedCategory !== 'All' && filteredEvents.length === 0) {
              return null;
            }

            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + clubIndex * 0.05 }}
              >
                <Card className="gradient-card border-border/50 overflow-hidden">
                  {/* Club Header */}
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <Avatar className="w-16 h-16 border-2 border-primary/20">
                        <AvatarImage src={club.avatar} alt={club.name} />
                        <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                          {club.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <CardTitle className="font-display text-xl flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-primary" />
                              {club.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <MapPin className="w-4 h-4" />
                              {club.location}
                              <span className="text-border">•</span>
                              <Users className="w-4 h-4" />
                              {club.memberCount.toLocaleString()} members
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {club.description}
                        </p>

                        {/* Club Wallet Address */}
                        <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Wallet className="w-3 h-3" />
                            Payment Wallet (Avalanche C-Chain)
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono truncate flex-1">
                              {club.walletAddress}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => {
                                navigator.clipboard.writeText(club.walletAddress);
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Events Section */}
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarDays className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold">Upcoming Events</h3>
                      <Badge variant="secondary" className="text-xs">
                        {filteredEvents.length}
                      </Badge>
                    </div>

                    {filteredEvents.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {filteredEvents.map((event) => {
                          const kesAmount = rates
                            ? convertToKES(event.price, 'AVAX', rates)
                            : 0;
                          const spotsPercentage =
                            (event.spotsRemaining / event.spots) * 100;

                          return (
                            <div
                              key={event.id}
                              className="p-4 rounded-xl bg-background/50 border border-border/30 hover:border-primary/30 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-semibold text-sm line-clamp-1">
                                  {event.title}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={`text-xs shrink-0 ${getCategoryColor(event.category)}`}
                                >
                                  {event.category}
                                </Badge>
                              </div>

                              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                {event.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(new Date(event.date), 'MMM d, yyyy')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {event.time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {event.spotsRemaining}/{event.spots} spots
                                </div>
                              </div>

                              {/* Spots Progress */}
                              <div className="mb-3">
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      spotsPercentage > 50
                                        ? 'bg-success'
                                        : spotsPercentage > 20
                                        ? 'bg-warning'
                                        : 'bg-destructive'
                                    }`}
                                    style={{ width: `${spotsPercentage}%` }}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm">
                                    {event.price} AVAX
                                  </span>
                                  {rates && (
                                    <span className="text-xs text-muted-foreground">
                                      ≈ {formatKES(kesAmount)}
                                    </span>
                                  )}
                                </div>
                                <Button variant="hero" size="sm">
                                  Register
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Dumbbell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          No events in this category. Check back soon!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-display text-xl font-semibold mb-2">
              No clubs found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or check back later for new clubs.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
