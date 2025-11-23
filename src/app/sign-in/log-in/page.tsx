import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
export default function SignInPage() {
  return (
    <GradientBackgroundFull>
  <HalfBackground></HalfBackground>
    </GradientBackgroundFull>
  );
}
