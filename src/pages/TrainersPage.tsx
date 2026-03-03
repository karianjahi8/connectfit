import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { TrainerCard } from '@/components/trainers/TrainerCard';
import { TrainerFilters } from '@/components/trainers/TrainerFilters';
import { LocationMap } from '@/components/maps/LocationMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Globe, Map, LayoutGrid } from 'lucide-react';
import { countries } from '@/lib/countries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockTrainers = [
  {
    id: '1', walletAddress: '0x1234...5678', name: 'James Mwangi',
    bio: 'Certified personal trainer with 8 years of experience in strength training and HIIT.',
    specialties: ['Strength Training', 'HIIT', 'Weight Loss'],
    physicalRate: 0.05, virtualRate: 0.03, location: 'Nairobi, Kenya', country: 'KE',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop&crop=face',
    rating: 4.8, totalSessions: 156, isVerified: true, lat: -1.2921, lng: 36.8219,
  },
  {
    id: '2', walletAddress: '0x2345...6789', name: 'Sarah Johnson',
    bio: 'Yoga instructor and wellness coach. Specializing in mindfulness and flexibility.',
    specialties: ['Yoga', 'Pilates', 'Meditation'],
    physicalRate: 0.04, virtualRate: 0.025, location: 'Los Angeles, USA', country: 'US',
    avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=face',
    rating: 4.9, totalSessions: 234, isVerified: true, lat: 34.0522, lng: -118.2437,
  },
  {
    id: '3', walletAddress: '0x3456...7890', name: 'David Ochieng',
    bio: 'Former athlete turned fitness coach. Expert in sports performance and endurance.',
    specialties: ['Sports Performance', 'Cardio', 'Endurance'],
    physicalRate: 0.06, virtualRate: 0.04, location: 'Kisumu, Kenya', country: 'KE',
    avatar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=150&h=150&fit=crop&crop=face',
    rating: 4.7, totalSessions: 189, isVerified: true, lat: -0.1022, lng: 34.7617,
  },
  {
    id: '4', walletAddress: '0x4567...8901', name: 'Priya Sharma',
    bio: 'Nutrition expert and fitness coach. Holistic approach to health and wellness.',
    specialties: ['Nutrition', 'Weight Loss', 'Lifestyle Coaching'],
    physicalRate: 0.045, virtualRate: 0.03, location: 'Mumbai, India', country: 'IN',
    avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&h=150&fit=crop&crop=face',
    rating: 4.6, totalSessions: 98, isVerified: false, lat: 19.0760, lng: 72.8777,
  },
  {
    id: '5', walletAddress: '0x5678...9012', name: 'Marcus Thompson',
    bio: 'CrossFit coach and bodybuilding specialist with a focus on functional fitness.',
    specialties: ['CrossFit', 'Bodybuilding', 'Strength Training'],
    physicalRate: 0.07, virtualRate: 0.05, location: 'London, UK', country: 'GB',
    avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=150&h=150&fit=crop&crop=face',
    rating: 4.8, totalSessions: 312, isVerified: true, lat: 51.5074, lng: -0.1278,
  },
];

export default function TrainersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const filteredTrainers = mockTrainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialties =
      selectedSpecialties.length === 0 ||
      trainer.specialties.some((s) => selectedSpecialties.includes(s));

    const matchesPrice =
      (trainer.physicalRate >= priceRange[0] && trainer.physicalRate <= priceRange[1]) ||
      (trainer.virtualRate >= priceRange[0] && trainer.virtualRate <= priceRange[1]);

    const matchesVerified = !verifiedOnly || trainer.isVerified;

    const matchesCountry = selectedCountry === 'all' || trainer.country === selectedCountry;

    return matchesSearch && matchesSpecialties && matchesPrice && matchesVerified && matchesCountry;
  });

  const mapLocations = filteredTrainers
    .filter((t) => t.lat && t.lng)
    .map((t) => ({
      id: t.id,
      name: t.name,
      lat: t.lat,
      lng: t.lng,
      type: 'trainer' as const,
      description: `${t.specialties[0]} • ${t.location}`,
    }));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Find Your <span className="gradient-text">Trainer</span>
          </h1>
          <p className="text-muted-foreground">
            Browse verified fitness professionals worldwide
          </p>
        </motion.div>

        {/* Search + Country filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialty, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full sm:w-48 h-12">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="All Countries" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="all">🌍 All Countries</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" className="h-12 w-12" onClick={() => setViewMode('grid')}>
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button variant={viewMode === 'map' ? 'default' : 'outline'} size="icon" className="h-12 w-12" onClick={() => setViewMode('map')}>
              <Map className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:w-72 shrink-0">
            <TrainerFilters
              selectedSpecialties={selectedSpecialties}
              onSpecialtiesChange={setSelectedSpecialties}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              verifiedOnly={verifiedOnly}
              onVerifiedOnlyChange={setVerifiedOnly}
            />
          </motion.aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredTrainers.length} trainers found
              </p>
            </div>

            {viewMode === 'map' ? (
              <LocationMap locations={mapLocations} className="h-[500px]" />
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTrainers.map((trainer, i) => (
                  <motion.div key={trainer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                    <TrainerCard trainer={trainer} />
                  </motion.div>
                ))}
              </div>
            )}

            {filteredTrainers.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No trainers found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
