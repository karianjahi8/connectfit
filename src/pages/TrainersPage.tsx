import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { TrainerCard } from '@/components/trainers/TrainerCard';
import { TrainerFilters } from '@/components/trainers/TrainerFilters';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

// Mock data - will be replaced with Supabase data
const mockTrainers = [
  {
    id: '1',
    walletAddress: '0x1234...5678',
    name: 'James Mwangi',
    bio: 'Certified personal trainer with 8 years of experience in strength training and HIIT.',
    specialties: ['Strength Training', 'HIIT', 'Weight Loss'],
    physicalRate: 0.05, // AVAX
    virtualRate: 0.03,
    location: 'Nairobi, Kenya',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    totalSessions: 156,
    isVerified: true,
  },
  {
    id: '2',
    walletAddress: '0x2345...6789',
    name: 'Sarah Wanjiku',
    bio: 'Yoga instructor and wellness coach. Specializing in mindfulness and flexibility.',
    specialties: ['Yoga', 'Pilates', 'Meditation'],
    physicalRate: 0.04,
    virtualRate: 0.025,
    location: 'Mombasa, Kenya',
    avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    totalSessions: 234,
    isVerified: true,
  },
  {
    id: '3',
    walletAddress: '0x3456...7890',
    name: 'David Ochieng',
    bio: 'Former athlete turned fitness coach. Expert in sports performance and endurance.',
    specialties: ['Sports Performance', 'Cardio', 'Endurance'],
    physicalRate: 0.06,
    virtualRate: 0.04,
    location: 'Kisumu, Kenya',
    avatar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=150&h=150&fit=crop&crop=face',
    rating: 4.7,
    totalSessions: 189,
    isVerified: true,
  },
  {
    id: '4',
    walletAddress: '0x4567...8901',
    name: 'Grace Akinyi',
    bio: 'Nutrition expert and fitness coach. Holistic approach to health and wellness.',
    specialties: ['Nutrition', 'Weight Loss', 'Lifestyle Coaching'],
    physicalRate: 0.045,
    virtualRate: 0.03,
    location: 'Nairobi, Kenya',
    avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&h=150&fit=crop&crop=face',
    rating: 4.6,
    totalSessions: 98,
    isVerified: false,
  },
];

export default function TrainersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

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

    return matchesSearch && matchesSpecialties && matchesPrice && matchesVerified;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Find Your <span className="gradient-text">Trainer</span>
          </h1>
          <p className="text-muted-foreground">
            Browse verified fitness professionals in Kenya
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialty, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            Kenya
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-72 shrink-0"
          >
            <TrainerFilters
              selectedSpecialties={selectedSpecialties}
              onSpecialtiesChange={setSelectedSpecialties}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              verifiedOnly={verifiedOnly}
              onVerifiedOnlyChange={setVerifiedOnly}
            />
          </motion.aside>

          {/* Trainer Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredTrainers.length} trainers found
              </p>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTrainers.map((trainer, i) => (
                <motion.div
                  key={trainer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <TrainerCard trainer={trainer} />
                </motion.div>
              ))}
            </div>

            {filteredTrainers.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  No trainers found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
