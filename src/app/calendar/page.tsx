
'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Tractor, Droplets, Wind, Wheat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const mockSchedules = {
  tomato: [
    { date: new Date(new Date().getFullYear(), 7, 15), activity: 'Sowing', type: 'sowing' as const, icon: Tractor, notes: 'Sow seeds 1/4 inch deep.' },
    { date: new Date(new Date().getFullYear(), 8, 5), activity: 'First Fertilization', type: 'fertilizing' as const, icon: Droplets, notes: 'Apply a balanced NPK fertilizer.' },
    { date: new Date(new Date().getFullYear(), 8, 20), activity: 'Pesticide Application', type: 'spraying' as const, icon: Wind, notes: 'Spray for aphids and whiteflies.' },
    { date: new Date(new Date().getFullYear(), 10, 10), activity: 'Harvesting Begins', type: 'harvesting' as const, icon: Wheat, notes: 'Harvest ripe tomatoes every 2-3 days.' },
  ],
  wheat: [
    { date: new Date(new Date().getFullYear(), 9, 25), activity: 'Sowing', type: 'sowing' as const, icon: Tractor, notes: 'Use a seed drill for uniform sowing.' },
    { date: new Date(new Date().getFullYear(), 10, 20), activity: 'Herbicide Application', type: 'spraying' as const, icon: Wind, notes: 'Control broadleaf weeds.' },
    { date: new Date(new Date().getFullYear() + 1, 1, 15), activity: 'Nitrogen Top-Dressing', type: 'fertilizing' as const, icon: Droplets, notes: 'Apply urea as per soil test.' },
    { date_str: new Date(new Date().getFullYear() + 1, 4, 20), activity: 'Harvesting', type: 'harvesting' as const, icon: Wheat, notes: 'Harvest when grains are hard and golden.' },
  ],
  corn: [
    { date: new Date(new Date().getFullYear(), 8, 1), activity: 'Planting', type: 'sowing' as const, icon: Tractor, notes: 'Plant in blocks for better pollination.' },
    { date: new Date(new Date().getFullYear(), 8, 25), activity: 'Side-Dress Nitrogen', type: 'fertilizing' as const, icon: Droplets, notes: 'Apply when corn is knee-high.' },
    { date: new Date(new Date().getFullYear(), 9, 15), activity: 'Fungicide Application', type: 'spraying' as const, icon: Wind, notes: 'Prevent common rust and gray leaf spot.' },
    { date: new Date(new Date().getFullYear(), 11, 20), activity: 'Harvesting', type: 'harvesting' as const, icon: Wheat, notes: 'Check for milky kernels before picking.' },
  ],
};

type ActivityType = 'sowing' | 'fertilizing' | 'spraying' | 'harvesting';

const activityDetails: Record<ActivityType, { color: string, Icon: React.ElementType }> = {
    sowing: { color: 'bg-green-500', Icon: Tractor },
    fertilizing: { color: 'bg-blue-500', Icon: Droplets },
    spraying: { color: 'bg-orange-500', Icon: Wind },
    harvesting: { color: 'bg-amber-500', Icon: Wheat },
};

export default function CalendarPage() {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const activities = mockSchedules[selectedCrop as keyof typeof mockSchedules] || [];
  const activityDays = activities.map(a => a.date ? new Date(a.date) : new Date(a.date_str!));
  
  const selectedDayActivities = selectedDate ? activities.filter(a => a.date && a.date.toDateString() === selectedDate.toDateString()) : [];

  return (
    <div className="container mx-auto max-w-5xl py-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
          <CalendarDays className="w-8 h-8" />
          Crop Calendar & Planner
        </h1>
        <p className="text-muted-foreground">Plan your season with crop-specific activity schedules.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crop Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tomato">Tomato</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="corn">Corn</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle>Upcoming Activities</CardTitle>
                <CardDescription>Click a date on the calendar to see details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {activities.map((act) => {
                    const { Icon, color } = activityDetails[act.type];
                    const date = act.date ? new Date(act.date) : new Date(act.date_str!);
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                        <div 
                            key={date.toISOString()} 
                            className={cn(
                                "flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-all",
                                isSelected ? "bg-primary/10 shadow-sm" : "hover:bg-muted/50"
                            )}
                            onClick={() => setSelectedDate(date)}
                        >
                            <div className={cn("mt-1 p-2 rounded-full text-white", color)}>
                                <Icon className="w-5 h-5"/>
                            </div>
                            <div>
                                <p className="font-semibold">{act.activity}</p>
                                <p className="text-sm text-muted-foreground">
                                  {date.toLocaleDateString(undefined, {month: 'long', day: 'numeric'})}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-2 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="p-4"
                modifiers={{ activity: activityDays }}
                modifiersClassNames={{
                    activity: "bg-primary/20 text-primary-foreground rounded-full relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-primary"
                }}
              />
            </CardContent>
          </Card>

           <AnimatePresence>
            {selectedDayActivities.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle>
                                Activity on {selectedDate?.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        {selectedDayActivities.map((act) => {
                            const { Icon, color } = activityDetails[act.type];
                             return (
                                <div key={act.activity} className="flex gap-4 items-start">
                                    <div className={cn("p-2 rounded-full text-white", color)}>
                                        <Icon className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{act.activity}</h4>
                                        <p className="text-muted-foreground">{act.notes}</p>
                                    </div>
                                </div>
                            )
                        })}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
