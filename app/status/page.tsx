"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import OrderStatusPanel from "@/components/emergencyLeakService/OrderStatusPanel";
import Footer from "@/components/emergencyLeakService/Footer";

function StatusContent() {
  const searchParams = useSearchParams();
  const referenceId = searchParams.get("referenceId") ?? "";

  if (!referenceId) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
        Missing <span className="font-bold">referenceId</span> query parameter.
        Please use the link provided in your email.
      </div>
    );
  }

  return (
    <OrderStatusPanel
      referenceId={referenceId}
      onDismiss={() => {
        // Navigate to the main intake form
        window.location.href = "/";
      }}
    />
  );
}

export default function StatusPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0d1b2a] via-[#122e30] to-[#163832]">
      <main className="flex-1 px-4 py-10 md:px-10">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
          {/* Header */}
          <header className="relative overflow-hidden bg-slate-900 px-6 py-7 text-white md:px-10">
            <div className="absolute inset-0">
              <Image
                src="/droneshot.png"
                alt=""
                fill
                className="object-cover opacity-25"
                priority
              />
              <div className="absolute inset-0 bg-slate-900/75" />
            </div>
            <div className="relative z-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Image
                src="/New-Logo-Final-White-1.svg"
                alt="Highland Commercial Roofing"
                width={210}
                height={42}
                className="h-auto w-[180px] sm:w-[210px]"
                priority
              />
              <h1 className="inline-block bg-red-900/35 px-3 py-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
                SERVICE ORDER STATUS
              </h1>
            </div>
          </header>

          {/* Content */}
          <div className="space-y-6 px-6 py-6 md:px-10">
            <Suspense
              fallback={
                <div className="flex items-center justify-center gap-3 p-8">
                  <svg
                    className="h-5 w-5 animate-spin text-emerald-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-slate-600">
                    Loading status…
                  </p>
                </div>
              }
            >
              <StatusContent />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
