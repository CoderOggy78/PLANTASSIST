
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Search, ShieldHalf, HeartPulse, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import type { Disease } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

interface KnowledgeBaseListProps {
  diseases: Disease[];
}

export default function KnowledgeBaseList({ diseases }: KnowledgeBaseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
        <div className="space-y-2">
          {filteredDiseases.map((disease) => {
            const image = getImageForDisease(disease.name);
            const isHovered = hoveredItem === disease.name;

            return (
              <div
                key={disease.name}
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  hoveredItem && !isHovered && "blur-[2px] opacity-50"
                )}
                onMouseEnter={() => setHoveredItem(disease.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Card className="overflow-hidden">
                    <div className="p-4 flex items-center gap-4 text-left w-full cursor-pointer bg-card hover:bg-muted/50">
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
                       <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isHovered && "rotate-180")} />
                    </div>

                  <div className={cn(
                    "grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-in-out",
                    isHovered && "grid-rows-[1fr]"
                  )}>
                    <div className="overflow-hidden">
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
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="text-center p-10">
          <p className="text-muted-foreground">No diseases found matching your search.</p>
        </Card>
      )}
    </div>
  );
}

