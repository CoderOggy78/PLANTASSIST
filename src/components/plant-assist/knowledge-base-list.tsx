
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Search, ShieldHalf, HeartPulse, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import type { Disease } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface KnowledgeBaseListProps {
  diseases: Disease[];
}

export default function KnowledgeBaseList({ diseases }: KnowledgeBaseListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.effects.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.remedies.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getImageForDisease = (diseaseName: string) => {
    return PlaceHolderImages.find(img => img.id.toLowerCase() === diseaseName.toLowerCase());
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search diseases..."
          className="w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredDiseases.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-2">
          {filteredDiseases.map((disease) => {
            const image = getImageForDisease(disease.name);

            return (
              <AccordionItem key={disease.name} value={disease.name} className="border-b-0">
                <Card className="overflow-hidden">
                  <AccordionTrigger className="p-4 flex items-center gap-4 text-left w-full cursor-pointer bg-card hover:bg-muted/50 hover:no-underline">
                    {image && (
                      <div className="relative w-20 h-16 flex-shrink-0">
                        <Image
                          src={image.imageUrl}
                          alt={disease.name}
                          fill
                          className="rounded-md object-cover"
                          data-ai-hint={image.imageHint}
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold flex-1">{disease.name}</h3>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-6 pt-2 space-y-4">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-1"><HeartPulse className="w-5 h-5 text-primary" />Effects</h4>
                        <p className="text-muted-foreground pl-7">{disease.effects}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-1"><ShieldHalf className="w-5 h-5 text-primary"/>Remedies</h4>
                        <p className="text-muted-foreground pl-7">{disease.remedies}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <Card className="text-center p-10">
          <p className="text-muted-foreground">No diseases found matching your search.</p>
        </Card>
      )}
    </div>
  );
}
