
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Notebook, Droplets, Spray, Wheat, BookOpen } from 'lucide-react';

const mockEntries = [
    { id: 1, date: '2024-07-20', type: 'Irrigation', details: 'Drip system, 45 minutes' },
    { id: 2, date: '2024-07-20', type: 'Fertilizer', details: '10-10-10 NPK, 2 lbs' },
    { id: 3, date: '2024-07-19', type: 'Harvest', details: 'Tomatoes, 15 lbs' },
    { id: 4, date: '2024-07-18', type: 'Pesticide', details: 'Neem Oil, 1 gallon solution' },
];

export default function DiaryPage() {
    const [date, setDate] = useState<Date>(new Date());

    return (
        <div className="container mx-auto max-w-3xl py-4">
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
                    <Notebook className="w-8 h-8" />
                    Digital Crop Diary
                </h1>
                <p className="text-muted-foreground">Keep a daily log of your farming activities.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Log New Entry</CardTitle>
                            <CardDescription>Select a date and the type of activity to log.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="mb-4">
                                <Label htmlFor="activity-date">Activity Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        id="activity-date"
                                        variant={"outline"}
                                        className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => setDate(d || new Date())}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                            </div>

                             <Tabs defaultValue="irrigation" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="irrigation"><Droplets className="w-4 h-4 mr-1"/>Irrigation</TabsTrigger>
                                    <TabsTrigger value="fertilizer"><BookOpen className="w-4 h-4 mr-1"/>Fertilizer</TabsTrigger>
                                    <TabsTrigger value="pesticide"><Spray className="w-4 h-4 mr-1"/>Pesticide</TabsTrigger>
                                    <TabsTrigger value="harvest"><Wheat className="w-4 h-4 mr-1"/>Harvest</TabsTrigger>
                                </TabsList>
                                <TabsContent value="irrigation" className="pt-4 space-y-4">
                                    <Input placeholder="e.g., Drip system, 45 minutes" />
                                    <Textarea placeholder="Add any extra notes here..." />
                                </TabsContent>
                                <TabsContent value="fertilizer" className="pt-4 space-y-4">
                                    <Input placeholder="e.g., 10-10-10 NPK" />
                                    <Input placeholder="e.g., 2 lbs" />
                                    <Textarea placeholder="Notes about application..." />
                                </TabsContent>
                                <TabsContent value="pesticide" className="pt-4 space-y-4">
                                    <Input placeholder="e.g., Neem Oil" />
                                    <Input placeholder="e.g., 1 gallon solution" />
                                    <Textarea placeholder="Notes on pests targeted..." />
                                </TabsContent>
                                <TabsContent value="harvest" className="pt-4 space-y-4">
                                     <Input placeholder="e.g., 15 lbs" />
                                     <Textarea placeholder="Notes about quality, etc." />
                                </TabsContent>
                            </Tabs>

                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Save Entry</Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Entries</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockEntries.length > 0 ? (
                                mockEntries.map(entry => (
                                    <div key={entry.id} className="text-sm">
                                        <p className="font-semibold">{entry.type} <span className="font-normal text-muted-foreground">- {entry.date}</span></p>
                                        <p className="text-muted-foreground">{entry.details}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center">No entries yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
