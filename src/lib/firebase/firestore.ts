
import firebase_app from "@/lib/firebase/client-app";
import { getFirestore, collection, getDocs, doc, onSnapshot, addDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDoc, runTransaction, DocumentData } from "firebase/firestore";
import type { Post, Comment } from "@/hooks/use-posts";

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
    // For now, we return mock data.
    return Promise.resolve(MOCK_SHOPS);
}

// =========================================================================
// POSTS FUNCTIONS
// =========================================================================

const db = getFirestore(firebase_app);
const postsCollection = collection(db, 'posts');

export const listenToPosts = (callback: (posts: Post[]) => void) => {
    return onSnapshot(postsCollection, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        callback(posts);
    });
};

export const addPostFirestore = async (postData: Omit<Post, 'id'>) => {
    return await addDoc(postsCollection, postData);
}

export const deletePostFirestore = async (postId: string) => {
    const postDoc = doc(db, 'posts', postId);
    await deleteDoc(postDoc);
}

export const likePostFirestore = async (postId: string, userId: string) => {
    const postRef = doc(db, 'posts', postId);
    await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
            throw "Document does not exist!";
        }
        
        const data = postDoc.data();
        const likedBy = data.likedBy || [];
        
        if (likedBy.includes(userId)) {
            // User has liked, so unlike
            transaction.update(postRef, {
                likes: (data.likes || 1) - 1,
                likedBy: arrayRemove(userId)
            });
        } else {
            // User has not liked, so like
            transaction.update(postRef, {
                likes: (data.likes || 0) + 1,
                likedBy: arrayUnion(userId)
            });
        }
    });
}

export const addCommentFirestore = async (postId: string, commentData: Comment) => {
    const postRef = doc(db, 'posts', postId);
    
    // Ensure the commentData is a plain object for Firestore
    const commentObject = { ...commentData };

    await updateDoc(postRef, {
        comments: arrayUnion(commentObject)
    });
};

export const getPostsCount = async () => {
    const snapshot = await getDocs(postsCollection);
    return snapshot.size;
}
