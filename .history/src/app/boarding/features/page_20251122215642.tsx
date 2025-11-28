"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import styles from "./features.module.css";

const features = [
    {
        id: 1,
        title: "AI-Powered Schedule Creation",
        description:
            "Let Tandem's smart AI scan your calendar and design the perfect childcare schedule for you.",
        imgSrc: "/boarding/Graphic-ai-powered-feature1.png",
    },
    {
        id: 2,
        title: "Seamless Nanny Booking",
        description:
            "Effortlessly discover and book reliable nannies tailored to your family's needs.",
        imgSrc: "/boarding/Seamless-nanny-booking-feature2.png",
    },
    {
        id: 3,
        title: "Intelligent Nanny Sharing",
        description:
            "Team up with nearby families to share trusted nannies, cutting costs while building lasting connections.",
        imgSrc: "/boarding/Intelligent-nanny-sharing-feature3.png",
    },
];

export default function FeaturesPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    const handleNext = () => {
        if (currentIndex < features.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            router.push("./sign-up");
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentFeature = features[currentIndex];

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img
                    src={currentFeature.imgSrc}
                    alt={`Feature ${currentFeature.id}`}
                />
            </div>
            <div className={styles["content-buttons"]}>
                <div className={styles.content}>
                    <h1 className={styles.title}>{currentFeature.title}</h1>

                    <p className={styles.description}>
                        {currentFeature.description}
                    </p>
                </div>
                <div className={styles.navigation}>
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        <IoIosArrowBack size={32} />
                    </button>

                    <button onClick={handleNext}>
                        <IoIosArrowForward size={32} />
                    </button>
                </div>
            </div>
        </div>
    );
}
