import RoomCanvas from "@/components/RoomCanvas";
import FurniturePanel from "@/components/FurniturePanel";

export default function Home() {
  return (
    <div className="h-full w-full flex items-center justify-center mt-[10rem]">
      <FurniturePanel />
      <RoomCanvas />
    </div>
  );
}
