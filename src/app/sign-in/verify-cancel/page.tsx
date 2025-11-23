import { LowerBackground } from "@/app/components/ui/backgrounds/LowerBackground";
import Image from "next/image";

export default function Verify() {
    return (
        <LowerBackground>
            <div className="relative z-10 flex min-h-screen flex-col items-center px-6 pt-8 sm:pt-12 lg:pt-15">
                {/* Smaller & elegant illustration */}
                <Image
                    src="/boarding/Authentication.svg"
                    alt="Authentication illustration"
                    width={300}
                    height={300}
                    priority
                    className="w-50 sm:w-56 md:w-64 lg:w-80 h-auto drop-shadow-xl"
                />
                <p className="text-gray-600 my-3 max-w-lg text-center text-sm sm:text-base">
                    You can add your company and employee ID later from your
                    profile. However, nanny sharing will not be available until
                    your workplace is verified for safety and trust reasons.
                </p>
                <div className="flex flex-row gap-3 w-full max-w-md my-4">
                    <button
                        type="submit"
                        className="flex-1 py-3 px-5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm sm:text-base shadow-md">
                        Login
                    </button>

                    <button
                        type="button"
                        className="flex-1 py-3 px-5 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm sm:text-base">
                        Sign up now
                    </button>
                </div>
            </div>
        </LowerBackground>
    );
}
