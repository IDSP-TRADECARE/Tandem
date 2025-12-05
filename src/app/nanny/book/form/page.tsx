"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { BottomNav } from "@/app/components/Layout/BottomNav";

type BookingData = {
  children: Array<{ name: string; age: string }>;
  allergies: string;
  medicalConditions: string;
  learningBehavioral: string;
  additionalNotes: string;
  language: string;
  certifications: string[];
  budgetMin: string;
  budgetMax: string;
  experience: string;
  otherCertification: string;
};

export default function NannyBookingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showOtherCertInput, setShowOtherCertInput] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    children: [{ name: "", age: "" }],
    allergies: "",
    medicalConditions: "",
    learningBehavioral: "",
    additionalNotes: "",
    language: "English",
    certifications: [],
    budgetMin: "20",
    budgetMax: "40",
    experience: "",
    otherCertification: "",
  });

  const [childrenCount, setChildrenCount] = useState(1);

  const addChild = () => {
    setBookingData((prev) => ({
      ...prev,
      children: [...prev.children, { name: "", age: "" }],
    }));
    setChildrenCount(childrenCount + 1);
  };

  const removeChild = () => {
    if (bookingData.children.length > 1) {
      setBookingData((prev) => ({
        ...prev,
        children: prev.children.slice(0, -1),
      }));
      setChildrenCount(Math.max(1, childrenCount - 1));
    }
  };

  const updateChild = (index: number, field: "name" | "age", value: string) => {
    setBookingData((prev) => ({
      ...prev,
      children: prev.children.map((child, i) =>
        i === index ? { ...child, [field]: value } : child
      ),
    }));
  };

  const toggleCertification = (cert: string) => {
    if (cert === "Others") {
      setShowOtherCertInput(!bookingData.certifications.includes(cert));
    }

    setBookingData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    console.log("Booking data:", bookingData);

    const params = new URLSearchParams(window.location.search);
    const returnDate = params.get("returnDate");

    if (returnDate) {
      await fetch("/api/nanny/bookings/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: returnDate, status: "pending" }),
      });
    }

    router.push("./schedule");
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <button
          onClick={currentStep === 1 ? () => router.back() : prevStep}
          className="p-2 -ml-2"
        >
          <IoIosArrowBack size={24} />
        </button>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        {/* Step 1: Family Info */}
        {currentStep === 1 && (
          <div>
            <h1 className="font-alan text-[26px] leading-[32px] font-[900] text-black mb-8">
              Tell us a little about your family
            </h1>

            <div className="mb-8">
              <label className="font-alan text-[18px] leading-[24px] font-[700] text-black mb-4 block">
                Number of children:
              </label>

              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={removeChild}
                  className="w-10 h-10 rounded-lg bg-green-400 text-white text-2xl flex items-center justify-center font-[700]"
                >
                  −
                </button>
                <div className="w-20 h-12 border-2 border-black rounded-lg flex items-center justify-center">
                  <span className="font-alan text-[20px] font-[700]">
                    {childrenCount}
                  </span>
                </div>
                <button
                  onClick={addChild}
                  className="w-10 h-10 rounded-lg bg-green-400 text-white text-2xl flex items-center justify-center font-[700]"
                >
                  +
                </button>
              </div>
            </div>

            {bookingData.children.map((child, index) => (
              <div key={index} className="mb-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="font-alan text-[18px] leading-[24px] font-[700] text-black mb-2 block">
                      Child {index + 1}
                    </label>
                    <input
                      type="text"
                      placeholder="Child name"
                      value={child.name}
                      onChange={(e) =>
                        updateChild(index, "name", e.target.value)
                      }
                      className="w-full pb-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none font-alan text-[16px] placeholder:text-gray-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="font-alan text-[18px] leading-[24px] font-[700] text-black mb-2 block">
                      Age
                    </label>
                    <input
                      type="text"
                      placeholder="Child age"
                      value={child.age}
                      onChange={(e) =>
                        updateChild(index, "age", e.target.value)
                      }
                      className="w-full pb-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none font-alan text-[16px] placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addChild}
              className="text-green-600 flex items-center gap-2 font-alan text-[16px] font-[600] mt-4"
            >
              <span className="text-2xl">+</span>
              Insert more child info
            </button>
          </div>
        )}

        {/* Step 2: Child Safety */}
        {currentStep === 2 && (
          <div>
            <h1 className="font-alan text-[26px] leading-[32px] font-[900] text-black mb-3">
              Help us keep your child safe
            </h1>
            <p className="font-alan text-[14px] leading-[20px] font-[400] text-gray-500 mb-8">
              Please share any important information about your child&apos;s
              needs
            </p>

            <div className="mb-6">
              <label className="font-alan text-[18px] leading-[24px] font-[700] text-black mb-3 block">
                Allergies
              </label>
              <input
                type="text"
                placeholder="e.g, food or environment"
                value={bookingData.allergies}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    allergies: e.target.value,
                  }))
                }
                className="w-full pb-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none font-alan text-[16px] placeholder:text-gray-400"
              />
            </div>

            <div className="mb-6">
              <label className="font-alan text-[18px] leading-[24px] font-[700] text-black mb-3 block">
                Medical conditions
              </label>
              <input
                type="text"
                placeholder="e.g, diagnoses or physical needs"
                value={bookingData.medicalConditions}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    medicalConditions: e.target.value,
                  }))
                }
                className="w-full pb-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none font-alan text-[16px] placeholder:text-gray-400"
              />
            </div>

            <div className="mb-6">
              <label className="font-alan text-[18px] leading-[24px] font-[700] text-black mb-3 block">
                Learning & Behavioral
              </label>
              <input
                type="text"
                placeholder="e.g, diagnoses or physical needs"
                value={bookingData.learningBehavioral}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    learningBehavioral: e.target.value,
                  }))
                }
                className="w-full pb-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none font-alan text-[16px] placeholder:text-gray-400"
              />
            </div>

            <div className="mb-6">
              <label className="font-alan text-[18px] leading-[24px] font-[700] text-black mb-3 block">
                Additional Notes
              </label>
              <textarea
                placeholder="Any other helpful info"
                value={bookingData.additionalNotes}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    additionalNotes: e.target.value,
                  }))
                }
                className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none font-alan text-[16px] placeholder:text-gray-400 min-h-32 resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Nanny Preferences */}
        {currentStep === 3 && (
          <div>
            <h1 className="font-alan text-[26px] leading-[32px] font-[900] text-black mb-3">
              Nanny preferences
            </h1>
            <p className="font-alan text-[14px] leading-[20px] font-[400] text-gray-500 mb-8">
              What are you looking for in a nanny?
            </p>

            <div className="mb-6">
              <label className="font-alan text-[18px] leading-[24px] font-[700] text-black mb-3 block">
                Language
              </label>
              <div className="p-4 border-2 border-gray-300 rounded-2xl flex justify-between items-center">
                <span className="font-alan text-[16px] font-[500]">
                  {bookingData.language}
                </span>
                <span className="text-gray-400">›</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <label className="font-alan text-[18px] leading-[24px] font-[700] text-black">
                  Certifications
                </label>
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-[700]">
                  ?
                </div>
              </div>

              <div className="space-y-3">
                {[
                  "CPR & First-Aid Certified",
                  "Early Childhood Education (ECE)",
                  "Special Needs Experience",
                  "Others",
                ].map((cert) => (
                  <button
                    key={cert}
                    onClick={() => toggleCertification(cert)}
                    className={`w-full p-4 border-2 rounded-3xl flex items-center gap-3 transition-colors ${
                      bookingData.certifications.includes(cert)
                        ? "bg-blue-100 border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        bookingData.certifications.includes(cert)
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {bookingData.certifications.includes(cert) && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <span className="font-alan text-[16px] font-[500]">
                      {cert}
                    </span>
                  </button>
                ))}
              </div>

              {showOtherCertInput &&
                bookingData.certifications.includes("Others") && (
                  <div className="mt-4">
                    <label className="font-alan text-[16px] font-[600] text-black mb-2 block">
                      Write your own:
                    </label>
                    <textarea
                      value={bookingData.otherCertification}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          otherCertification: e.target.value,
                        }))
                      }
                      className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none font-alan text-[16px] placeholder:text-gray-400 min-h-24 resize-none"
                    />
                  </div>
                )}
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <label className="font-alan text-[18px] leading-[24px] font-[700] text-black">
                  Budget
                </label>
                <span className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-alan font-[600]">
                  Recommend
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="font-alan text-[14px] font-[600] text-gray-600 mb-2 block">
                    Minimum
                  </label>
                  <input
                    type="text"
                    value={`$${bookingData.budgetMin}`}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        budgetMin: e.target.value.replace("$", ""),
                      }))
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-2xl text-center font-alan text-[16px] font-[600] focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-alan text-[14px] font-[600] text-gray-600 mb-2 block">
                    Maximum
                  </label>
                  <input
                    type="text"
                    value={`$${bookingData.budgetMax}`}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        budgetMax: e.target.value.replace("$", ""),
                      }))
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-2xl text-center font-alan text-[16px] font-[600] focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="font-alan text-[18px] leading-[24px] font-[700] text-black mb-3 block">
                Experience
              </label>
              <input
                type="text"
                placeholder="e.g, 5 years"
                value={bookingData.experience}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    experience: e.target.value,
                  }))
                }
                className="w-full pb-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none font-alan text-[16px] placeholder:text-gray-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 py-4 bg-white flex gap-4 mt-auto">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            className="px-8 py-3 border-2 border-[#1e3a5f] text-[#1e3a5f] rounded-full flex items-center justify-center gap-2 font-alan text-[16px] font-[700]"
          >
            <IoIosArrowBack />
            Back
          </button>
        )}
        <button
          onClick={currentStep === 3 ? handleSubmit : nextStep}
          className="flex-1 py-3 bg-[#4F46E5] text-white rounded-full flex items-center justify-center gap-2 font-alan text-[16px] font-[700]"
        >
          Next
          {currentStep < 3 && <span className="text-xl">›</span>}
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
