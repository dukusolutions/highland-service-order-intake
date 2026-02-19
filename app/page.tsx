import EmergencyLeakServiceForm from "@/components/EmergencyLeakServiceForm";
import Footer from "@/components/emergencyLeakService/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1e2a3a]">
      <main className="flex-1 px-4 py-10 md:px-10">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
          <EmergencyLeakServiceForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
