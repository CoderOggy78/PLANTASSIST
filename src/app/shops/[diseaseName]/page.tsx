
import { getShops } from '@/lib/firebase/firestore';
import ShopCard from '@/components/plant-assist/shop-card';
import { Store, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default async function ShopsPage({ params }: { params: { diseaseName: string } }) {
  const diseaseName = decodeURIComponent(params.diseaseName);
  const shops = await getShops(diseaseName);

  return (
    <div className="container mx-auto max-w-2xl py-4">
      <header className="mb-6">
        <motion.div whileTap={{ scale: 0.95 }}>
            <Button asChild variant="ghost" className="mb-2">
                <Link href="/">
                    <ArrowLeft className="mr-2"/>
                    Back to Diagnosis
                </Link>
            </Button>
        </motion.div>
        <div className="text-center">
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center justify-center gap-3">
                <Store className="w-8 h-8"/>
                Nearby Agri-Shops
            </h1>
            <p className="text-muted-foreground">Find sellers for remedies to treat <strong>{diseaseName}</strong>.</p>
        </div>
      </header>

      {shops.length > 0 ? (
        <div className="space-y-4">
          {shops.map(shop => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-10">
          <p>No shops found that carry remedies for {diseaseName}.</p>
          <p>Please check local listings.</p>
        </div>
      )}
    </div>
  );
}
