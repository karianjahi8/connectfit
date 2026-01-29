import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageCircle,
  Send,
  Search,
  AlertCircle,
  Video,
  Phone,
} from 'lucide-react';

// Mock conversations
const mockConversations = [
  {
    id: '1',
    trainer: {
      name: 'James Mwangi',
      avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop&crop=face',
    },
    lastMessage: 'Great! I will see you at 10 AM tomorrow at the gym.',
    timestamp: '2 min ago',
    unread: true,
  },
  {
    id: '2',
    trainer: {
      name: 'Sarah Wanjiku',
      avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=face',
    },
    lastMessage: 'Thank you for the session! How did you find it?',
    timestamp: '1 hour ago',
    unread: false,
  },
  {
    id: '3',
    trainer: {
      name: 'David Ochieng',
      avatar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=150&h=150&fit=crop&crop=face',
    },
    lastMessage: 'Let me know if you have any questions about the program.',
    timestamp: 'Yesterday',
    unread: false,
  },
];

const mockMessages = [
  {
    id: '1',
    sender: 'trainer',
    message: 'Hi! Thanks for booking a session with me. Looking forward to helping you reach your fitness goals!',
    timestamp: '10:00 AM',
  },
  {
    id: '2',
    sender: 'client',
    message: 'Hi James! I am excited to start. What should I bring for our first session?',
    timestamp: '10:05 AM',
  },
  {
    id: '3',
    sender: 'trainer',
    message: 'Just bring comfortable workout clothes, a towel, and a water bottle. I will have all the equipment ready.',
    timestamp: '10:08 AM',
  },
  {
    id: '4',
    sender: 'client',
    message: 'Perfect! And the address is Nairobi Fitness Hub, right?',
    timestamp: '10:10 AM',
  },
  {
    id: '5',
    sender: 'trainer',
    message: 'Yes, that is correct! 3rd floor, studio B. There is parking available in the basement.',
    timestamp: '10:12 AM',
  },
  {
    id: '6',
    sender: 'trainer',
    message: 'Great! I will see you at 10 AM tomorrow at the gym.',
    timestamp: '10:15 AM',
  },
];

export default function MessagesPage() {
  const { isConnected } = useAccount();
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Would send message via Socket.io
      setNewMessage('');
    }
  };

  if (!isConnected) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">
              Wallet Not Connected
            </h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to access messages.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const activeConversation = mockConversations.find(
    (c) => c.id === selectedConversation
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Messages</span>
          </h1>
          <p className="text-muted-foreground">
            Chat with your trainers and clients
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="gradient-card border-border/50 overflow-hidden">
            <div className="flex h-[calc(100vh-280px)] min-h-[500px]">
              {/* Conversations List */}
              <div className="w-full md:w-80 lg:w-96 border-r border-border/50">
                <div className="p-4 border-b border-border/50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <ScrollArea className="h-[calc(100%-73px)]">
                  {mockConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors border-b border-border/30 ${
                        selectedConversation === conversation.id
                          ? 'bg-muted/50'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={conversation.trainer.avatar}
                            alt={conversation.trainer.name}
                          />
                          <AvatarFallback>
                            {conversation.trainer.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold truncate">
                              {conversation.trainer.name}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {conversation.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unread && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                        )}
                      </div>
                    </button>
                  ))}
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className="hidden md:flex flex-1 flex-col">
                {activeConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={activeConversation.trainer.avatar}
                            alt={activeConversation.trainer.name}
                          />
                          <AvatarFallback>
                            {activeConversation.trainer.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {activeConversation.trainer.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Online
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {mockMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.sender === 'client'
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                                msg.sender === 'client'
                                  ? 'gradient-primary text-primary-foreground rounded-br-md'
                                  : 'bg-muted rounded-bl-md'
                              }`}
                            >
                              <p className="text-sm">{msg.message}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.sender === 'client'
                                    ? 'text-primary-foreground/70'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {msg.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-4 border-t border-border/50">
                      <div className="flex items-center gap-3">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          variant="hero"
                          size="icon"
                          onClick={handleSendMessage}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Select a conversation to start chatting
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
