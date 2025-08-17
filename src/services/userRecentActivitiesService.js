import {
  collectionGroup,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  collection,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const fetchRecentActivities = async(userId) => {
    const commentsQuery = query(
      collectionGroup(db, "comments"),
      where("userId", "==", userId),
      orderBy("globalTimestamp", "desc"),
      limit(5)
    );

    const likesQuery = query(
      collectionGroup(db, "likes"),
      where("userId", "==", userId),
      orderBy("globalTimestamp", "desc"),
      limit(5)
    );

    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("globalTimestamp", "desc"),
      limit(5)
    );

    const [commentSnap, likeSnap, postSnap] = await Promise.all([
      getDocs(commentsQuery),
      getDocs(likesQuery),
      getDocs(postsQuery),
    ])

    const comments = commentSnap.docs.map((doc) => ({
      key: Math.floor(Math.random() * 100000),
      id: doc.id,
      type: 'comment',
      ...doc.data()
    }))

    const likes = likeSnap.docs.map((doc) => ({
      key: Math.floor(Math.random() * 100000),
      id: doc.id,
      type: 'like',
      ...doc.data()
    }))

    const posts = postSnap.docs.map((doc) => ({
      key: Math.floor(Math.random() * 100000),
      id: doc.id,
      type: 'post',
      ...doc.data()
    }))

    const activities = [...comments, ...likes, ...posts]
    activities.sort((a, b) => b.globalTimestamp.toMillis() - a.globalTimestamp.toMillis())

    return activities.slice(0,3)

  };