"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/app/components/ui/splash/splashScreen";

export default function App() {
    const [showSplash, setShowSplash] = useState(true);
    const router = useRouter();

    const handleSplashComplete = () => {
        setShowSplash(false);
        router.push("/sign-up");
    };

    if (showSplash) {
        return <SplashScreen onComplete={handleSplashComplete} />;
    }

    return null;
}
