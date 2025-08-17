import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { getUserProfile } from "../services/profileService";
import useLoading from "./useLoading";

export function useUserProfileById(userId) {
    const [profile, setProfile] = useState(null)
    const [error, setError] = useState(null)
    const {isLoading, withLoading} = useLoading()

    useEffect(() => {

        if (!userId) {
            setProfile(null)
            setError(null)
            return;
        }

        withLoading(async() => {
            
            try {
                const data = await getUserProfile(userId)
                setProfile(data)
                setError(null);
            } catch (err) {
                setError(err.message)
            }
        })
    },[userId])

    return {profile, error, isLoading}
}
