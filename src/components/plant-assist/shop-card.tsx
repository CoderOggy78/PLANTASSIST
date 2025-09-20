
import type { Shop } from '@/lib/firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone } from 'lucide-react';
import { Button } from '../ui/button';

interface ShopCardProps {
  shop: Shop;
}

export default function ShopCard({ shop }: ShopCardProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`;
  const telUrl = `tel:${shop.phone}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{shop.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <MapPin className="w-5 h-5 flex-shrink-0 text-primary" />
          <span>{shop.address}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Phone className="w-5 h-5 flex-shrink-0 text-primary" />
          <span>{shop.phone}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-2"/> View on Map
                </a>
            </Button>
            <Button asChild className="w-full sm:w-auto">
                <a href={telUrl}>
                    <Phone className="mr-2"/> Call Shop
                </a>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
