import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input, { TextArea } from "../../common-components/input";
import RepoOptions from "./RepoOptions";
import Button from "../../common-components/button";
import { RepositoriesContext } from "../../context/RepositoriesContext/RepositoriesContext";

export default function CreateRepoForm() {
  const { createRepository } = useContext(RepositoriesContext);
  const navigate = useNavigate();
  const [visibility, setVisibiility] = useState("option1"); // option1=Public, option2=Private
  const [readMe, setReadMe] = useState("option1"); // option1=Yes, option2=No
  const [gitIgnore, setGitIgnore] = useState("option1"); // option1=Yes, option2=No

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleCreate = async () => {
    if (!name) {
      alert("Repository Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createRepository({
        name,
        description,
        isPrivate: visibility === "option2" ? "private" : "public",
        auto_init: readMe === "option1" ? "Yes" : "No",
        gitignore_template: gitIgnore === "option1" ? "Yes" : "No",
        isImport: false // Explicitly calling create-remote
      });
      alert("Repository created successfully!");
      navigate('/repositories');
    } catch (error) {
      alert(`Failed to create repository: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl px-16 py-8 gap-3 shadow-gray-800 shadow-md bg-(--card-bg) justify-center items-center border border-(--main-border-color)">
      <div className="w-fit flex flex-col items-center ">
        <h1 className="font-semibold my-2.5 text-xl">Create New Repository</h1>
      </div>
      <div className="w-fit">
        <hr className=" w-full border-(--main-border-color) mt-4 mb-8" />
        <Input
          label={"Repository Name"}
          placeholder={"My Repository..."}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextArea
          label={"Description"}
          placeholder={"the repo is.."}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

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
          <Button
            className="rounded-xl px-8 py-2 my-2 disabled:opacity-50"
            variant="primary"
            onClick={handleCreate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Repository"}
          </Button>
        </div>
      </div>
    </div>
  );
}
