
'use client';

import { handleUserMessage, type ChatState } from '@/lib/chat-actions';
import { Send, Bot, User, Loader2, Mic, StopCircle, Play } from 'lucide-react';
import { useActionState, useRef, useEffect, useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';

const initialState: ChatState = {
  messages: [],
};

export default function ChatInterface() {
  const [state, formAction, isPending] = useActionState(handleUserMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [state.messages]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audioBlob', audioBlob, 'recording.webm');
        
        // Wrap the action in a transition to correctly update pending state
        React.startTransition(() => {
            formAction(formData);
        });

        audioChunksRef.current = [];
        stream.getTracks().forEach(track => track.stop()); // Stop the microphone access
      };
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: 'destructive',
        title: 'Microphone Error',
        description: 'Could not access the microphone. Please check your browser permissions.',
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlayAudio = (audioDataUri: string) => {
    const audio = new Audio(audioDataUri);
    audio.play();
  };

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
                  'max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl whitespace-pre-wrap flex items-center gap-2',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {msg.content}
                {msg.role === 'model' && msg.audio && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePlayAudio(msg.audio!)}>
                    <Play className="w-4 h-4"/>
                  </Button>
                )}
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
          action={(formData) => {
            formAction(formData);
            formRef.current?.reset();
          }}
          className="flex items-center gap-2"
        >
          <Input
            name="userMessage"
            placeholder="Type or record your message..."
            className="flex-1"
            autoComplete="off"
          />
           <Button type="submit" size="icon" disabled={isPending || isRecording}>
            <Send className="w-5 h-5" />
          </Button>
          {isRecording ? (
            <Button type="button" size="icon" onClick={handleStopRecording} variant="destructive" disabled={isPending}>
              <StopCircle className="w-5 h-5" />
            </Button>
          ) : (
            <Button type="button" size="icon" onClick={handleStartRecording} disabled={isPending}>
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
