"use client";
import RoomPlanner from "@/components/RoomPlanner";
import { useUIStore } from "@/store/uiStore";
import RoomSizePicker from "@/components/RoomSizePicker";
import WallEditor from "@/components/WallEditor";
import WallPanel from "@/components/WallPanel";

export default function Home() {
  const { step } = useUIStore();

  const renderStep = () => {
    if (step === 1) return <RoomSizePicker />;
    if (step === 2) return <WallPanel />;
    if (step === 3) return <RoomPlanner />;
  };

  return (
    <div className="h-full w-full flex items-center justify-center mt-[10rem]">
      {renderStep()}
    </div>
  );
}
