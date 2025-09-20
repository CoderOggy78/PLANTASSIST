
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Landmark, ArrowRight, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockSchemes = [
  {
    id: 1,
    title: 'National Crop Insurance Programme (NCIP)',
    description: 'Provides financial support to farmers in the event of crop failure due to natural calamities, pests, or diseases.',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.',
    crop: 'All',
    region: 'National',
  },
  {
    id: 2,
    title: 'Subsidy on Micro-Irrigation Systems',
    description: 'Promotes water conservation by providing financial assistance for installing drip and sprinkler irrigation systems.',
    eligibility: 'All categories of farmers.',
    crop: 'All',
    region: 'State',
  },
  {
    id: 3,
    title: 'PM-KISAN Scheme',
    description: 'An income support scheme where all small and marginal farmers will get up to ₹6,000 per year as minimum income support.',
    eligibility: 'Small and marginal farmers with cultivable land up to 2 hectares.',
    crop: 'All',
    region: 'National',
  },
   {
    id: 4,
    title: 'State Horticulture Mission',
    description: 'A scheme to promote the cultivation of high-value horticultural crops like fruits, vegetables, and flowers.',
    eligibility: 'Individual farmers, farmer groups, and cooperative societies.',
    crop: 'Horticulture',
    region: 'State',
  }
];

export default function SchemesPage() {
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const filteredSchemes = mockSchemes.filter(scheme => {
    const cropMatch = selectedCrop === 'all' || scheme.crop.toLowerCase() === selectedCrop || scheme.crop === 'All';
    const regionMatch = selectedRegion === 'all' || scheme.region.toLowerCase() === selectedRegion;
    return cropMatch && regionMatch;
  });

  return (
    <div className="container mx-auto max-w-4xl py-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
          <Landmark className="w-8 h-8" />
          Government Schemes & Alerts
        </h1>
        <p className="text-muted-foreground">Stay updated on the latest agricultural schemes, subsidies, and insurance.</p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Filter className="w-5 h-5"/>
            Filter Schemes
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="region-filter" className="text-sm font-medium text-muted-foreground">Region</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger id="region-filter">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="national">National</SelectItem>
                <SelectItem value="state">State Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div>
             <label htmlFor="crop-filter" className="text-sm font-medium text-muted-foreground">Crop Type</label>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger id="crop-filter">
                <SelectValue placeholder="Filter by crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="horticulture">Horticulture</SelectItem>
                <SelectItem value="grains">Grains</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map(scheme => (
            <Card key={scheme.id}>
              <CardHeader>
                <CardTitle>{scheme.title}</CardTitle>
                <div className="flex gap-2 pt-1">
                    <Badge variant="secondary">{scheme.region}</Badge>
                    {scheme.crop !== 'All' && <Badge variant="outline">{scheme.crop}</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{scheme.description}</p>
                <div>
                    <h4 className="font-semibold text-sm">Eligibility</h4>
                    <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Learn More & Apply <ArrowRight className="ml-2 w-4 h-4"/>
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-10 text-center">
                <p className="text-muted-foreground">No schemes found for the selected filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
