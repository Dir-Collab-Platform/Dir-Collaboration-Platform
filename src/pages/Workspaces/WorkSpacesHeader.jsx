import { Star, Workflow } from "lucide-react";

export default function WorkSpacesHeader() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <img
          className="w-12 h-12 rounded-full"
          src="https://comebackapp.net/wp-content/uploads/2018/12/portrait-square-04.jpg"
          alt="profilepic"
        />
        <div className="flex flex-col">
          <span className="font-semibold">Saron Kiflu</span>
          <span className="font-light text-xs">@saron</span>
        </div>
      </div>
      <div className="flex gap-4">
        <span className="flex text-sm font-semibold gap-2">
          <Workflow size={16} />
          Workspaces 20
        </span>
        <span className="flex text-sm font-semibold gap-2">
          <Star size={16} />
          Stars 50
        </span>
      </div>
    </div>
  );
}
