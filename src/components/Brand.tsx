// src/components/Brand.tsx
import logo from "@/assets/twocents.png";

export default function Brand() {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="TwoCents" className="h-9 w-9 rounded" />
    </div>
  );
}