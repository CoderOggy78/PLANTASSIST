
'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Tractor, Droplets, Wind } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockSchedules = {
  tomato: [
    { date: '2024-08-15', activity: 'Sowing', type: 'sowing', icon: Tractor },
    { date: '2024-09-05', activity: 'First Fertilization', type: 'fertilizing', icon: Droplets },
    { date: '2024-09-20', activity: 'Pesticide Application', type: 'spraying', icon: Wind },
    { date: '2024-11-10', activity: 'Harvesting Begins', type: 'harvesting', icon: Tractor },
  ],
  wheat: [
    { date: '2024-10-25', activity: 'Sowing', type: 'sowing', icon: Tractor },
    { date: '2024-11-20', activity: 'Herbicide Application', type: 'spraying', icon: Wind },
    { date: '2025-02-15', activity: 'Nitrogen Top-Dressing', type: 'fertilizing', icon_component: Droplets },
    { date: '2025-05-20', activity: 'Harvesting', type: 'harvesting', icon: Tractor },
  ],
  corn: [
    { date: '2024-09-01', activity: 'Planting', type: 'sowing', icon: Tractor },
    { date: '2024-09-25', activity: 'Side-Dress Nitrogen', type: 'fertilizing', icon: Droplets },
    { date: '2024-10-15', activity: 'Fungicide Application', type: 'spraying', icon: Wind },
    { date: '2024-12-20', activity: 'Harvesting', type: 'harvesting', icon: Tractor },
  ],
};

type ActivityType = 'sowing' | 'fertilizing' | 'spraying' | 'harvesting';

const activityColors: Record<ActivityType, string> = {
    sowing: 'bg-green-500',
    fertilizing: 'bg-blue-500',
    spraying: 'bg-orange-500',
    harvesting: 'bg-yellow-500',
}


export default function CalendarPage() {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const activities = mockSchedules[selectedCrop as keyof typeof mockSchedules] || [];
  
  const activityDays = activities.map(a => new Date(a.date));

  return (
    <div className="container mx-auto max-w-4xl py-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
          <CalendarDays className="w-8 h-8" />
          Crop Calendar & Planner
        </h1>
        <p className="text-muted-foreground">Plan your season with crop-specific activity schedules.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Select Your Crop</CardTitle>
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
                </CardHeader>
                <CardContent className="space-y-3">
                    {activities.map((act) => {
                        const ActivityIcon = act.icon;
                        return (
                             <div key={act.date} className="flex items-start gap-3">
                                <div className={`mt-1 p-1.5 rounded-full ${activityColors[act.type as ActivityType]} text-white`}>
                                    <ActivityIcon className="w-4 h-4"/>
                                </div>
                                <div>
                                    <p className="font-semibold">{act.activity}</p>
                                    <p className="text-sm text-muted-foreground">{new Date(act.date).toLocaleDateString(undefined, {month: 'long', day: 'numeric'})}</p>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-0 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-4"
                modifiers={{
                    activity: activityDays
                }}
                modifiersClassNames={{
                    activity: "bg-primary/20 rounded-full"
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
