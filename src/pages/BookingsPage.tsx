import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle,
  XCircle,
  Star,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Mock bookings data
const mockBookings = [
  {
    id: '1',
    trainer: {
      name: 'James Mwangi',
      avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop&crop=face',
    },
    date: '2026-01-30',
    time: '10:00 AM',
    sessionType: 'in-person',
    location: 'Nairobi Fitness Hub',
    amount: 25.00,
    status: 'upcoming',
  },
  {
    id: '2',
    trainer: {
      name: 'Sarah Wanjiku',
      avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=face',
    },
    date: '2026-01-28',
    time: '2:00 PM',
    sessionType: 'virtual',
    location: 'Zoom Meeting',
    amount: 18.00,
    status: 'completed',
    rating: 5,
  },
  {
    id: '3',
    trainer: {
      name: 'David Ochieng',
      avatar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=150&h=150&fit=crop&crop=face',
    },
    date: '2026-01-25',
    time: '8:00 AM',
    sessionType: 'in-person',
    location: 'Kisumu Sports Center',
    amount: 30.00,
    status: 'cancelled',
  },
];

type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export default function BookingsPage() {
  const { isAuthenticated, login } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('upcoming');

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'upcoming':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  const filteredBookings = mockBookings.filter(
    (booking) => activeTab === 'all' || booking.status === activeTab
  );

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">
              Sign In Required
            </h2>
            <p className="text-muted-foreground mb-6">
              Sign in to view your bookings.
            </p>
            <Button variant="hero" onClick={login}>Get Started</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            My <span className="gradient-text">Bookings</span>
          </h1>
          <p className="text-muted-foreground">
            View and manage your training sessions
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <Card className="gradient-card border-border/50">
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No {activeTab === 'all' ? '' : activeTab} bookings found.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredBookings.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="gradient-card border-border/50 hover:shadow-medium transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <img
                              src={booking.trainer.avatar}
                              alt={booking.trainer.name}
                              className="w-14 h-14 rounded-full border-2 border-primary/20"
                            />
                            <div>
                              <h3 className="font-display font-semibold text-lg">
                                {booking.trainer.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {booking.date}
                                <span className="mx-1">•</span>
                                <Clock className="w-4 h-4" />
                                {booking.time}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {booking.sessionType === 'virtual' ? (
                              <Video className="w-4 h-4 text-primary" />
                            ) : (
                              <MapPin className="w-4 h-4 text-primary" />
                            )}
                            <span className="text-sm">{booking.location}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <Badge
                              variant="outline"
                              className={`flex items-center gap-1.5 ${getStatusColor(
                                booking.status as BookingStatus
                              )}`}
                            >
                              {getStatusIcon(booking.status as BookingStatus)}
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </Badge>

                            <span className="font-display font-bold">
                              ${booking.amount.toFixed(2)}
                            </span>

                            {booking.status === 'upcoming' && (
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Cancel
                                </Button>
                                <Button variant="hero" size="sm">
                                  Start Session
                                </Button>
                              </div>
                            )}

                            {booking.status === 'completed' && !booking.rating && (
                              <Button variant="hero" size="sm">
                                <Star className="w-4 h-4" />
                                Leave Review
                              </Button>
                            )}

                            {booking.rating && (
                              <div className="flex items-center gap-1">
                                {Array.from({ length: booking.rating }).map(
                                  (_, i) => (
                                    <Star
                                      key={i}
                                      className="w-4 h-4 text-warning fill-warning"
                                    />
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
