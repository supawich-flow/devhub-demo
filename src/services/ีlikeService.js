import { setDoc, doc, serverTimestamp, getDoc, deleteDoc, updateDoc, increment,} from "firebase/firestore";
import { db } from "../lib/firebase";
import { runTransaction } from "firebase/firestore";

export const handleLike = async (postId, currentUser) => {
  const postRef = doc(db, "posts", postId);
  const likeRef = doc(db, "posts", postId, "likes", currentUser.uid);

  await runTransaction(db, async (transaction) => {
    const likeSnap = await transaction.get(likeRef);

    if (likeSnap.exists()) {
      transaction.delete(likeRef);
      transaction.update(postRef, {
        likeCount: increment(-1),
      });
    } else {
      transaction.set(likeRef, {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userAvatar: currentUser.photoURL || null,
        likedAt: serverTimestamp(),
        globalTimestamp: serverTimestamp(),
        type: "like",
      });
      transaction.update(postRef, {
        likeCount: increment(1),
      });
    }
  });
};