"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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
        <GradientBackgroundFull>
            <div className='min-h-screen flex flex-col items-center justify-center p-8'>
                <div className='max-w-3xl w-full text-center mb-8'>
                    <div className='h-96 flex items-center justify-center my-6'>
                        <img
                            src={currentFeature.imgSrc}
                            alt={`Feature ${currentFeature.id}`}
                        />
                    </div>

                    <h1>{currentFeature.title}</h1>

                    <p>{currentFeature.description}</p>
                </div>

                <div className='flex items-center gap-8'>
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
        </GradientBackgroundFull>
    );
}
