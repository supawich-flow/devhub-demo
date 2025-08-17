import { db } from "../lib/firebase"
import { getDocs,collection,where,query } from "firebase/firestore"

export const searchPostsByText = async (searchText) => {
    const endText = searchText + '\uf8ff'
    const postRef = collection(db,'posts')
    const postQuery = query(postRef, where('text', '>=', searchText), where('text', '<=', endText))
    const postSnapshot = await getDocs(postQuery)
    return postSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }))
}

export const searchUsersByDisplayName = async (searchText) => {
    const endText = searchText + '\uf8ff'
    const userRef = collection(db,'profiles')
    const userQuery = query(userRef, where('displayName', '>=', searchText), where('displayName', '<=', endText))
    const userSnapshot = await getDocs(userQuery)
    return userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }))
}