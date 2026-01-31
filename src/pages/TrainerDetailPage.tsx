import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import {
  Star,
  MapPin,
  CheckCircle,
  Clock,
  Dumbbell,
  Shield,
  Calendar as CalendarIcon,
  Video,
  Users,
  ArrowLeft,
  Wallet,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { PaymentMethodSelector, type PaymentMethod } from '@/components/payments/PaymentMethodSelector';
import { useExchangeRates, formatKES, convertToKES } from '@/hooks/useExchangeRates';

// Mock trainer data - would come from database
const mockTrainer = {
  id: '1',
  walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
  name: 'James Mwangi',
  bio: 'Certified personal trainer with 8 years of experience in strength training and HIIT. I specialize in helping clients achieve their fitness goals through personalized workout plans and nutrition guidance. My approach focuses on sustainable lifestyle changes that lead to long-term results.',
  specialties: ['Strength Training', 'HIIT', 'Weight Loss', 'Nutrition', 'Bodybuilding'],
  physicalRate: 0.05,
  virtualRate: 0.03,
  location: 'Nairobi, Kenya',
  avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop&crop=face',
  rating: 4.8,
  totalSessions: 156,
  isVerified: true,
  certificationHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
  availability: [
    { day: 'Monday', slots: ['9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'] },
    { day: 'Tuesday', slots: ['9:00 AM', '11:00 AM', '3:00 PM'] },
    { day: 'Wednesday', slots: ['10:00 AM', '2:00 PM', '5:00 PM'] },
    { day: 'Thursday', slots: ['9:00 AM', '1:00 PM', '4:00 PM'] },
    { day: 'Friday', slots: ['10:00 AM', '3:00 PM'] },
  ],
  reviews: [
    {
      id: '1',
      clientName: 'Alice K.',
      rating: 5,
      comment: 'Excellent trainer! James helped me lose 15kg in 3 months with his personalized program.',
      date: '2026-01-15',
    },
    {
      id: '2',
      clientName: 'Bob M.',
      rating: 5,
      comment: 'Very professional and motivating. Highly recommend for anyone serious about fitness.',
      date: '2026-01-10',
    },
    {
      id: '3',
      clientName: 'Carol N.',
      rating: 4,
      comment: 'Great sessions, learned proper form for all exercises. Worth every AVAX!',
      date: '2026-01-05',
    },
  ],
};

const timeSlots = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
];

export default function TrainerDetailPage() {
  const { id } = useParams();
  const { isConnected, address } = useAccount();
  const { data: rates } = useExchangeRates();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<'in-person' | 'virtual'>('in-person');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('AVAX');
  const [isBooking, setIsBooking] = useState(false);

  const trainer = mockTrainer; // Would fetch by ID
  
  // Calculate amounts based on payment method and session type
  const currentRate = sessionType === 'in-person' ? trainer.physicalRate : trainer.virtualRate;
  const avaxAmount = currentRate;
  const usdcAmount = rates ? (avaxAmount * rates.avaxToUsd) / rates.usdcToUsd : avaxAmount * 35;
  const kesAmount = rates ? convertToKES(avaxAmount, 'AVAX', rates) : 0;
  const physicalKes = rates ? convertToKES(trainer.physicalRate, 'AVAX', rates) : 0;
  const virtualKes = rates ? convertToKES(trainer.virtualRate, 'AVAX', rates) : 0;

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    if (paymentMethod === 'MPESA') {
      toast.error('M-Pesa payments coming soon!');
      return;
    }

    setIsBooking(true);

    try {
      // Would call smart contract here based on payment method:
      // if (paymentMethod === 'AVAX') {
      //   const tx = await bookingEscrow.createBooking(..., { value: parseEther(avaxAmount) });
      // } else if (paymentMethod === 'USDC') {
      //   await usdc.approve(bookingEscrowAddress, parseUSDC(usdcAmount));
      //   const tx = await bookingEscrow.createBookingWithToken(usdc, ...);
      // }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const displayAmount = paymentMethod === 'AVAX' 
        ? `${avaxAmount} AVAX` 
        : `${usdcAmount.toFixed(2)} USDC`;

      toast.success('Booking confirmed!', {
        description: `Session with ${trainer.name} on ${format(selectedDate, 'PPP')} at ${selectedTime}. Paid ${displayAmount}`,
      });

      setSelectedDate(undefined);
      setSelectedTime(null);
    } catch (error) {
      toast.error('Booking failed', {
        description: 'Please try again or check your wallet connection.',
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link to="/trainers">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Trainers
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="gradient-card border-border/50">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <Avatar className="w-28 h-28 border-4 border-primary/20 shadow-glow">
                      <AvatarImage src={trainer.avatar} alt={trainer.name} />
                      <AvatarFallback className="gradient-primary text-3xl font-bold text-primary-foreground">
                        {trainer.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h1 className="font-display text-2xl md:text-3xl font-bold">
                              {trainer.name}
                            </h1>
                            {trainer.isVerified && (
                              <CheckCircle className="w-6 h-6 text-success" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {trainer.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 text-warning fill-warning" />
                          <span className="font-bold text-lg">{trainer.rating}</span>
                          <span className="text-muted-foreground">
                            ({trainer.reviews.length} reviews)
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Dumbbell className="w-4 h-4" />
                          <span>{trainer.totalSessions} sessions</span>
                        </div>
                        {trainer.isVerified && (
                          <Badge className="gradient-accent text-accent-foreground gap-1">
                            <Shield className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <p className="text-muted-foreground leading-relaxed">
                        {trainer.bio}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <h3 className="font-semibold mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {trainer.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Wallet Address Display */}
                  <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Wallet className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Payment Wallet (Avalanche C-Chain)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-background/50 border border-border/30">
                      <code className="text-xs text-muted-foreground font-mono truncate flex-1">
                        {trainer.walletAddress}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 h-8 px-2"
                        onClick={() => {
                          navigator.clipboard.writeText(trainer.walletAddress);
                          toast.success('Wallet address copied!');
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Accepts AVAX & USDC on Avalanche C-Chain
                    </p>
                  </div>

                  {trainer.isVerified && trainer.certificationHash && (
                    <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-success text-sm">
                          <Shield className="w-4 h-4" />
                          <span>Certification verified on-chain</span>
                        </div>
                        <a
                          href={`https://ipfs.io/ipfs/${trainer.certificationHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-success hover:underline flex items-center gap-1"
                        >
                          View on IPFS
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trainer.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-xl bg-muted/30 border border-border/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{review.clientName}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-3.5 h-3.5 text-warning fill-warning"
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <Card className="gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="font-display">
                    <div className="flex items-center justify-between">
                      <span>Book Session</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="p-2 rounded-lg bg-muted/30 text-center">
                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1">
                          <Users className="w-3 h-3" />
                          Physical
                        </div>
                        <span className="gradient-text font-bold">
                          {trainer.physicalRate} AVAX
                        </span>
                        {rates && (
                          <p className="text-xs text-muted-foreground">
                            ≈ {formatKES(physicalKes)}
                          </p>
                        )}
                      </div>
                      <div className="p-2 rounded-lg bg-muted/30 text-center">
                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-1">
                          <Video className="w-3 h-3" />
                          Virtual
                        </div>
                        <span className="gradient-text font-bold">
                          {trainer.virtualRate} AVAX
                        </span>
                        {rates && (
                          <p className="text-xs text-muted-foreground">
                            ≈ {formatKES(virtualKes)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Session Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Session Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={sessionType === 'in-person' ? 'default' : 'outline'}
                        onClick={() => setSessionType('in-person')}
                        className="gap-2"
                      >
                        <Users className="w-4 h-4" />
                        In-Person
                      </Button>
                      <Button
                        variant={sessionType === 'virtual' ? 'default' : 'outline'}
                        onClick={() => setSessionType('virtual')}
                        className="gap-2"
                      >
                        <Video className="w-4 h-4" />
                        Virtual
                      </Button>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Date</label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-lg border"
                    />
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Available Times</label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  {selectedDate && selectedTime && rates && (
                    <PaymentMethodSelector
                      selected={paymentMethod}
                      onSelect={setPaymentMethod}
                      amount={avaxAmount}
                      rates={rates}
                    />
                  )}

                  {/* Summary */}
                  {selectedDate && selectedTime && (
                    <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">
                          {format(selectedDate, 'PPP')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium capitalize">{sessionType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Payment</span>
                        <span className="font-medium">{paymentMethod}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                        <span className="text-muted-foreground">Total</span>
                        <div className="text-right">
                          <span className="font-bold">
                            {paymentMethod === 'AVAX' 
                              ? `${avaxAmount} AVAX` 
                              : paymentMethod === 'USDC'
                              ? `${usdcAmount.toFixed(2)} USDC`
                              : formatKES(kesAmount)}
                          </span>
                          {rates && paymentMethod !== 'MPESA' && (
                            <span className="block text-xs text-muted-foreground">
                              ≈ {formatKES(kesAmount)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  {isConnected ? (
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={!selectedDate || !selectedTime || isBooking || paymentMethod === 'MPESA'}
                      onClick={handleBook}
                    >
                      {isBooking ? (
                        'Confirming...'
                      ) : paymentMethod === 'MPESA' ? (
                        'M-Pesa Coming Soon'
                      ) : (
                        <>
                          <Wallet className="w-4 h-4" />
                          Pay with {paymentMethod}
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">
                      Connect your wallet to book a session
                    </div>
                  )}

                  <p className="text-xs text-center text-muted-foreground">
                    15% platform fee included. Funds held in escrow until session
                    completion.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
