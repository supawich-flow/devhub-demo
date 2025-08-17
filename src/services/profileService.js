import { doc,getDoc,setDoc } from "firebase/firestore";
import { db,auth } from "../lib/firebase";

export const saveUserProfile = async(uid,profileData) => {
    if (!uid) throw new Error("No user ID");

    const userDocRef = doc(db, 'profiles', uid)
    await setDoc(userDocRef,profileData, { merge: true })
    
};

export const getUserProfile = async(uid) => {
    if (!uid) throw new Error("No user ID");

    const userDocRef = doc(db, 'profiles', uid)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}