import { Pencil } from "lucide-react";
import Button from "../../../common-components/button";

export default function Sidebar() {
  return (
    <>
      <div className="relative max-w-xs">
        <img
          className="w-64 h-64 rounded-full"
          src="https://comebackapp.net/wp-content/uploads/2018/12/portrait-square-04.jpg"
          alt="profilepic"
        />
        <Button
          className={
            "rounded-md py-2 absolute top-2 right-4 px-4 flex justify-center items-center gap-3"
          }
        >
          <Pencil size={20} />
          <span className="font-normal">Edit</span>
        </Button>
      </div>
      <div>
        <h3 className="font-semibold text-2xl">Preferences</h3>
        <hr className="bg-gray-500 my-2 max-w-xs" />
        <div>
          <p className="font-semibold text-xl my-2">Notification</p>
          <div className="flex gap-1 items-center mb-1.5">
            <input type="radio" name="notification" id="notOn" value={"on"} />
            <label htmlFor="notOn">On</label>
          </div>
          <div className="flex gap-1 items-center mb-1.5">
            <input type="radio" name="notification" id="notOff" value={"off"} />
            <label htmlFor="notOff">Off</label>
          </div>
        </div>
        <div>
          <p className="font-semibold text-xl my-2">Theme</p>
          <div className="flex gap-1 items-center mb-1.5">
            <input type="radio" name="theme" id="light" value={"light"} />
            <label htmlFor="light">light mode</label>
          </div>
          <div className="flex gap-1 items-center mb-1.5">
            <input type="radio" name="theme" id="night" value={"night"} />
            <label htmlFor="night">night mode</label>
          </div>
        </div>
      </div>
    </>
  );
}
