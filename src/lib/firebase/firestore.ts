
'use server';
import firebase_app from "@/lib/firebase/client-app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// For this example, we'll define a type for our shop data and use mock data.
// In a real application, this data would live in your Firestore database.
export interface Shop {
    id: string;
    name: string;
    address: string;
    phone: string;
    // You could add location (GeoPoint), available remedies, etc.
}

const MOCK_SHOPS: Shop[] = [
    { id: '1', name: 'Green Valley Agri Supplies', address: '123 Farm Road, Central District', phone: '555-0101' },
    { id: '2', name: 'CropCare Solutions', address: '456 Planters Ave, North Region', phone: '555-0102' },
    { id: '3', name: 'Farmer\'s Friend Store', address: '789 Harvest Lane, South Valley', phone: '555-0103' },
    { id: '4', name: 'Agri-Mart', address: '101 Seedling Street, Central District', phone: '555-0104' },
];


/**
 * Fetches a list of agro-shops.
 * In a real application, you would filter this by location and available products.
 * @param diseaseName - The name of the disease to find remedies for.
 * @returns A promise that resolves to an array of shops.
 */
export async function getShops(diseaseName: string): Promise<Shop[]> {
    console.log(`Fetching shops that sell remedies for: ${diseaseName}`);
    
    // In a real app, you might have a 'shops' collection and a 'products' subcollection.
    // You could query for shops that have a product for the given `diseaseName`.
    // Example with actual Firestore:
    /*
    const db = getFirestore(firebase_app);
    const shopsCol = collection(db, 'shops');
    const shopSnapshot = await getDocs(shopsCol);
    const shopList = shopSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Shop));
    return shopList;
    */

    // For now, we return mock data.
    return Promise.resolve(MOCK_SHOPS);
}
