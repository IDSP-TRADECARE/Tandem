import { SignUp } from "@clerk/nextjs";
import Image from "next/image"; // <- necessário!

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-400 light-blue-200 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex justify-center">
            <Image 
              src="/writtenLogo.png" 
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
  );
}
