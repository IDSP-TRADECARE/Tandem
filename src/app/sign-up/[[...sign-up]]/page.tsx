import { SignUp } from "@clerk/nextjs";
import Image from "next/image"; 
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";


export default function SignUpPage() {
  return (
    <GradientBackgroundFull>
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-500 via-blue-400 light-blue-200 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex justify-center">
            <Image 
              src="brand/nameWhite.svg" 
              alt="Logo"
              width={200}      
              height={200}     
            />
          </h1>
        </div>
        <SignUp 
          routing="path" 
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>
    </div>
    </GradientBackgroundFull>
  );
}
