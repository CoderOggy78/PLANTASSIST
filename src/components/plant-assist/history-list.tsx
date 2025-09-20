
"use client";

import Image from 'next/image';
import { useHistory } from '@/hooks/use-history';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function HistoryList() {
  const { history, clearHistory, isLoaded } = useHistory();

  if (!isLoaded) {
      return (
          <div className="space-y-4">
              <Skeleton className="h-36 w-full rounded-lg" />
              <Skeleton className="h-36 w-full rounded-lg" />
          </div>
      )
  }

  if (history.length === 0) {
    return (
      <Card className="text-center">
        <CardContent className="p-8">
          <p className="text-muted-foreground">You have no past identifications.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <Card key={item.id} className="flex flex-col sm:flex-row overflow-hidden">
          <div className="sm:w-1/3 relative h-36 sm:h-auto flex-shrink-0">
            <Image
              src={item.image}
              alt={item.result.plantName || 'Plant'}
              fill
              className="object-cover"
            />
          </div>
          <div className="sm:w-2/3 flex flex-col">
            <CardHeader>
              <CardTitle>{item.result.diseaseName || `Healthy ${item.result.plantName}` || 'Analysis Result'}</CardTitle>
              <CardDescription>
                {item.result.diseaseName ? `Identified on ${item.date}` : 'No disease was detected.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {item.result.diseaseName && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.result.effects || 'No effects described.'}</p>
                )}
                 {!item.result.diseaseName && (
                    <p className="text-sm text-muted-foreground">The plant was identified as a {item.result.plantName} and appears to be healthy.</p>
                )}
            </CardContent>
          </div>
        </Card>
      ))}

      {history.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your entire identification history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearHistory}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
