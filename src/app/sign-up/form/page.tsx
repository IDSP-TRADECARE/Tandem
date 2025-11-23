"use client";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { LabeledInput } from "@/app/components/forms/textInput";
import React, { useState } from "react";

export default function Form() {
    const [firstName, setFirstName] = useState("");

    return (
        <GradientBackgroundFull>
            <HalfBackground>
                <div className=' p-4'>
                    <LabeledInput
                        label='First Name'
                        placeholder='John'
                        value={firstName}
                        onChange={setFirstName}
                        type='text'
                    />
                </div>
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
