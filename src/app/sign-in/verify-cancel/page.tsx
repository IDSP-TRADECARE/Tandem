import { LowerBackground } from "@/app/components/ui/backgrounds/LowerBackground";
import Image from "next/image";

export default function Verify() {
    return (
        <LowerBackground>
            <div className="absolute left-1/2 top-4 -translate-x-1/2 transform">
                <div className="h-2 w-20 rounded-full bg-black md:w-24 lg:w-28" />
            </div>
            <div className="relative z-10 flex min-h-screen flex-col items-center px-6 pt-8 sm:pt-12 lg:pt-15">
                <Image
                    src="/boarding/Authentication.svg"
                    alt="Authentication illustration"
                    width={300}
                    height={300}
                    priority
                    className="w-50 sm:w-56 md:w-64 lg:w-80 h-auto drop-shadow-xl"
                />
                 <h1 className="font-bold text-2xl font-alan mb-1 text-center">
                        Skip workplace verification?
                    </h1>
                <p className="text-gray-600 my-3 max-w-lg text-center text-sm sm:text-base">
                    You can add your company and employee ID later from your
                    profile. However, nanny sharing will not be available until
                    your workplace is verified for safety and trust reasons.
                </p>
                <div className="flex flex-row gap-3 w-full max-w-md my-4">
                    <button
                        type="button" // usually "button" for a "Back" action, not submit
                        className="flex-1 py-3 px-5 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm sm:text-base shadow-md">
                        Back to add
                    </button>

                    <button
                        type="button"
                        className="flex-1 py-3 px-5 bg-[#C43535] text-white font-semibold rounded-xl hover:bg-[#a72e2e] active:bg-[#902828] transition-colors text-sm sm:text-base shadow-md">
                        Skip Anyways
                    </button>
                </div>
            </div>
        </LowerBackground>
    );
}
