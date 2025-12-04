"use client";
import React, { useEffect, useRef } from "react";

const Camera: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 },
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
                alert("Could not access camera. Please allow permission.");
            }
        };
        startCamera();

        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);
    return (
        <div>
            <h2 className='font-omnes text-xl'>Camera View</h2>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: "100%",
                    maxWidth: "640px",
                }}
                className='border-primary-normal border-2 rounded-2xl'
            />
            <p className='font-omnes'>
                Allow camera permission to see the video feed.
            </p>
        </div>
    );
};

export default Camera;
