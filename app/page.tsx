import EmergencyLeakServiceForm from "@/components/EmergencyLeakServiceForm";
import IntakeHeader from "@/components/emergencyLeakService/IntakeHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1e2a3a] px-4 py-10 md:px-10">
      <main className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
        <IntakeHeader />
        <EmergencyLeakServiceForm className="space-y-8 px-6 py-8 md:px-10" />
      </main>
    </div>
  );
}
