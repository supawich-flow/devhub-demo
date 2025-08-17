import {useState } from "react";

export default function useLoading() {
    const [isLoading, setIsLoading] = useState(false)

    const withLoading = async(asyncFunc) => {
        setIsLoading(true)
        try {
            await asyncFunc();
        } finally {
            setIsLoading(false)
        }
    }
    return { isLoading, withLoading }
}