import Image from "next/image";
import { GradientBackgroundFull } from "@/app/components/ui/backgrounds/GradientBackgroundFull";
import { HalfBackground } from "@/app/components/ui/backgrounds/HalfBackground";
export default function SignInPage() {
    return (
        <GradientBackgroundFull>
            <div className="flex min-h-screen flex-col items-center justify-start pt-15 px-4">
                <h1 className="text-4xl font-bold text-white mb-2 flex justify-center">
                    <Image
                        src="/brand/nameWhite.svg"
                        alt="Logo"
                        width={200}
                        height={200}
                    />
                </h1>
            </div>
            <HalfBackground>
                <div>
                    <h1 className="font-bold text-3xl font-alan p-8">Log In</h1>
                    <div className="flex min-h-[50vh] items-center justify-center px-4">
                        <div className="flex flex-col gap-4 w-full max-w-sm">
                            <button
                                type="submit"
                                className="w-full py-4 px-8 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg shadow-lg">
                                Login
                            </button>

                            <button
                                type="button"
                                className="w-full py-4 px-8 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-colors text-lg">
                                New user? Sign up now
                            </button>
                        </div>
                    </div>
                </div>
            </HalfBackground>
        </GradientBackgroundFull>
    );
}
