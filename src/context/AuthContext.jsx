import { createContext, useContext, useEffect,useState } from "react"
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signOut } from "firebase/auth"

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth , (user) => {
            setCurrentUser(user);
            setLoading(false);
        })
        
        return unsubscribe;

    },[])

    const logout = () => {
        return signOut(auth);
    };

    console.log(currentUser)
    const value = { currentUser, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );

}

    export function useAuth() {
        return useContext(AuthContext)
    }

