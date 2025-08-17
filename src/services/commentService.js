import { db } from "../lib/firebase"
import { collection,addDoc,serverTimestamp } from "firebase/firestore"


export const addCommentToPost = async(postId, commentText, currentUser) => {
    const commentRef = collection(db, 'posts', postId, 'comments');
    
    await addDoc(commentRef, {
        text: commentText,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userAvatar: currentUser.photoURL || null,
        createdAt: serverTimestamp(),
        globalTimestamp: serverTimestamp(),
        type: 'comment',
    });
};