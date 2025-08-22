import EnergyMonitor from "@/components/EnergyMonitor";
import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8">
      <div className="fixed top-1.5 right-1.5">
        <ModeToggle />
      </div>
      <main className="container mx-auto">
        <EnergyMonitor />
      </main>
    </div>
  );
}
