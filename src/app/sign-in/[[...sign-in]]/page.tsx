import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
export default function SignInPage() {
  return (
    <GradientBackgroundFull>
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-4">
            <Image
              src="/writtenLogo.png" 
              alt="Logo"
              width={200}      
              height={200}     
            />
          </h1>
        </div>
        <SignIn 
          routing="path" 
          path="/sign-in"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
    </GradientBackgroundFull>
  );
}
