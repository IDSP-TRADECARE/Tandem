"use client";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { LabeledInput } from "@/app/components/forms/textInput";
import React, { useState } from "react";

export default function Form() {
    const [email, setEmail] = useState("");

    return (
        <GradientBackgroundFull>
            <HalfBackground>
                <LabeledInput
                    label='Email Address'
                    placeholder='you@example.com'
                    value={email}
                    onChange={setEmail}
                    type='email'
                />
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
