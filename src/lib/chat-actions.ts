'use server';

import { askPlantDoctor } from "@/ai/flows/ask-plant-doctor";

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export interface ChatState {
    messages: ChatMessage[];
}

export async function handleUserMessage(prevState: ChatState, formData: FormData): Promise<ChatState> {
    const userMessage = formData.get('userMessage') as string;

    if (!userMessage) {
        return prevState;
    }

    const newMessages: ChatMessage[] = [
        ...prevState.messages,
        { role: 'user', content: userMessage },
    ];
    
    try {
        const modelResponse = await askPlantDoctor(userMessage);
        
        return {
            messages: [
                ...newMessages,
                { role: 'model', content: modelResponse },
            ],
        };

    } catch (error) {
        console.error(error);
        return {
            messages: [
                ...newMessages,
                { role: 'model', content: 'Sorry, I encountered an error. Please try again.' },
            ],
        };
    }
}
