import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { TrainerCard } from '@/components/trainers/TrainerCard';
import { TrainerFilters } from '@/components/trainers/TrainerFilters';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Globe } from 'lucide-react';
import { COUNTRIES, getCountryName } from '@/lib/countries';
import { useSelectedCountry } from '@/hooks/useSelectedCountry';

const mockTrainers = [
  {
    id: '1',
    walletAddress: '0x1234...5678',
    name: 'Maya Thompson',
    bio: 'Performance coach helping busy professionals build strength, mobility, and consistency.',
    specialties: ['Strength Training', 'HIIT', 'Weight Loss'],
    physicalRate: 70,
    virtualRate: 40,
    location: 'New York, USA',
    country: 'US',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    totalSessions: 156,
    isVerified: true,
  },
  {
    id: '2',
    walletAddress: '0x2345...6789',
    name: 'Aisha Khan',
    bio: 'Yoga instructor and recovery specialist focused on mindfulness, posture, and flexibility.',
    specialties: ['Yoga', 'Pilates', 'Meditation'],
    physicalRate: 55,
    virtualRate: 35,
    location: 'Dubai, UAE',
    country: 'AE',
    avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    totalSessions: 234,
    isVerified: true,
  },
  {
    id: '3',
    walletAddress: '0x3456...7890',
    name: 'Daniel Otieno',
    bio: 'Former athlete turned endurance coach for runners, triathletes, and hybrid fitness plans.',
    specialties: ['Sports Performance', 'Cardio', 'Endurance'],
    physicalRate: 60,
    virtualRate: 38,
    location: 'Nairobi, Kenya',
    country: 'KE',
    avatar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=150&h=150&fit=crop&crop=face',
    rating: 4.7,
    totalSessions: 189,
    isVerified: true,
  },
  {
    id: '4',
    walletAddress: '0x4567...8901',
    name: 'Lerato Mokoena',
    bio: 'Holistic trainer combining nutrition, conditioning, and sustainable lifestyle coaching.',
    specialties: ['Nutrition', 'Weight Loss', 'Lifestyle Coaching'],
    physicalRate: 50,
    virtualRate: 32,
    location: 'Cape Town, South Africa',
    country: 'ZA',
    avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&h=150&fit=crop&crop=face',
    rating: 4.6,
    totalSessions: 98,
    isVerified: false,
  },
];

export default function TrainersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const { selectedCountry, setSelectedCountry } = useSelectedCountry();

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
    const matchesCountry = trainer.country === selectedCountry;

    return matchesSearch && matchesSpecialties && matchesPrice && matchesVerified && matchesCountry;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Find Your <span className="gradient-text">Trainer</span>
          </h1>
          <p className="text-muted-foreground">Browse fitness professionals in {getCountryName(selectedCountry)}</p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-[1fr_240px] mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search by name, specialty, or location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 text-base" />
          </motion.div>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="h-12">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Select country" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
              <p className="text-sm text-muted-foreground">{filteredTrainers.length} trainers found in {getCountryName(selectedCountry)}</p>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTrainers.map((trainer, i) => (
                <motion.div key={trainer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                  <TrainerCard trainer={trainer} />
                </motion.div>
              ))}
            </div>

            {filteredTrainers.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No trainers found matching your criteria in this region.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
