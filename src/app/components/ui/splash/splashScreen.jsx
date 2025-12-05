"use client";
import { useEffect, useState } from "react";
import { GradientBackgroundFull } from "../backgrounds/GradientBackgroundFull";
import styles from "./SplashScreen.module.css";

export function SplashScreen({ onComplete }) {
    const [logoVisible, setLogoVisible] = useState(false);
    const [logoScale, setLogoScale] = useState(false);
    const [whiteOverlay, setWhiteOverlay] = useState(false);

    useEffect(() => {
        const fadeInTimer = setTimeout(() => {
            setLogoVisible(true);
        }, 2000);

        const scaleTimer = setTimeout(() => {
            setLogoScale(true);
            setWhiteOverlay(true);
        }, 3500);

        const completeTimer = setTimeout(() => {
            if (onComplete) {
                onComplete();
            }
        }, 5500);

        return () => {
            clearTimeout(fadeInTimer);
            clearTimeout(scaleTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <GradientBackgroundFull>
            <div className={styles.container}>
                <div
                    className={`${styles.logoContainer} ${
                        logoVisible ? styles.visible : ""
                    } ${logoScale ? styles.scaled : ""}`}
                >
                    <img
                        src='whiteLogo.svg'
                        alt='Logo'
                        className={styles.logo}
                    />
                </div>

                <div
                    className={`${styles.whiteOverlay} ${
                        whiteOverlay ? styles.visible : ""
                    }`}
                ></div>
            </div>
        </GradientBackgroundFull>
    );
}
