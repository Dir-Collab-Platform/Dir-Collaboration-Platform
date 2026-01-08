import { useState } from "react";
import Input, { TextArea } from "../../common-components/input";
import RepoOptions from "./RepoOptions";
import Button from "../../common-components/button";

export default function CreateRepoForm() {
  const [visibility, setVisibiility] = useState("option1");
  const [readMe, setReadMe] = useState("option1");
  const [gitIgnore, setGitIgnore] = useState("option1");

  const handleVisbility = () => {
    if (visibility === "option1") {
      setVisibiility("option2");
    } else {
      setVisibiility("option1");
    }
  };
  const handleReadMe = () => {
    if (readMe === "option1") {
      setReadMe("option2");
    } else {
      setReadMe("option1");
    }
  };
  const handleGitIgnore = () => {
    if (gitIgnore === "option1") {
      setGitIgnore("option2");
    } else {
      setGitIgnore("option1");
    }
  };

  return (
    <div className="flex flex-col rounded-2xl px-16 py-8 gap-3 shadow-gray-800 shadow-md bg-(--card-bg) justify-center items-center border border-(--main-border-color)">
      <div className="w-fit flex flex-col items-center ">
        <h1 className="font-semibold my-2.5 text-xl">Create New Repository</h1>
      </div>
      <div className="w-fit">
        <hr className=" w-full border-(--main-border-color) mt-4 mb-8" />
        <Input label={"Repository Name"} placeholder={"My Repository..."} />
        <TextArea label={"Description"} placeholder={"the repo is.."} />

        <div className="flex flex-col gap-4 items-center mt-8">
          <RepoOptions
            label={"Choose Visiblity"}
            option1={"Public"}
            option2={"Private"}
            onStateChange={handleVisbility}
            activeState={visibility}
          />
          <RepoOptions
            label={"Add README"}
            option1={"Yes"}
            option2={"No"}
            onStateChange={handleReadMe}
            activeState={readMe}
          />
          <RepoOptions
            label={"ss .gitignore"}
            option1={"Yes"}
            option2={"No"}
            onStateChange={handleGitIgnore}
            activeState={gitIgnore}
          />
          <Button className="rounded-xl px-8 py-2 my-2" variant="primary">
            Create Repository
          </Button>
        </div>
      </div>
    </div>
  );
}
