'use client';

import { handleUserMessage, type ChatState } from '@/lib/chat-actions';
import { Paperclip, Send, Bot, User, Loader2 } from 'lucide-react';
import { useActionState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const initialState: ChatState = {
  messages: [],
};

export default function ChatInterface() {
  const [state, formAction, isPending] = useActionState(handleUserMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [state.messages]);

  return (
    <div className="flex flex-col h-full bg-card border rounded-lg shadow-sm">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {state.messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'model' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback><Bot/></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl whitespace-pre-wrap',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {msg.content}
              </div>
               {msg.role === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback><User/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isPending && (
             <div className="flex items-start gap-3 justify-start">
                <Avatar className="w-8 h-8">
                  <AvatarFallback><Bot/></AvatarFallback>
                </Avatar>
                 <div className="bg-muted px-4 py-3 rounded-xl flex items-center">
                    <Loader2 className="h-5 w-5 text-primary animate-spin"/>
                 </div>
             </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form
          ref={formRef}
          action={formAction}
          onSubmit={(e) => {
            formAction(new FormData(e.currentTarget));
            formRef.current?.reset();
          }}
          className="flex items-center gap-2"
        >
          <Input
            name="userMessage"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            required
          />
          <Button type="submit" size="icon" disabled={isPending}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
