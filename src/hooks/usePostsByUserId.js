import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export function usePostsByUserId(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async() => {
      setLoading(true);
      try {
        const q = query(
            collection(db, 'posts'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q)
        const result = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        setPosts(result)
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts()
  }, [userId]);

  return { posts, loading }
}
