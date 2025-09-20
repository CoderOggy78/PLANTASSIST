import ChatInterface from '@/components/plant-assist/chat-interface';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="container mx-auto max-w-2xl h-[calc(100vh-64px-1rem)] flex flex-col py-4">
       <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
            <MessageSquare className="w-8 h-8"/>
            AI Chat Assistant
        </h1>
        <p className="text-muted-foreground">Ask the Plant Doctor any question about your crops.</p>
      </header>
      <ChatInterface />
    </div>
  );
}
