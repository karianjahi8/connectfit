import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isBot = role === 'assistant';

  return (
    <div className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <Avatar className="w-7 h-7 shrink-0 mt-0.5">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isBot
            ? 'bg-muted text-foreground rounded-bl-md'
            : 'bg-primary text-primary-foreground rounded-br-md'
        }`}
      >
        {isBot ? (
          <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:m-0 [&>ul]:mt-1 [&>ol]:mt-1">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p>{content}</p>
        )}
      </div>
      {!isBot && (
        <Avatar className="w-7 h-7 shrink-0 mt-0.5">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
