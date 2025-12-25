import Button from "../../../common-components/button";
import Input, { TextArea } from "../../../common-components/input";

export default function ProfileForm() {
  return (
    <>
      <Input
        label="Name"
        placeholder={"saron kiflu"}
        description={
          "Your name may appear around Dir where you contribute or are mentioned"
        }
      />
      <Input
        className={"mt-2"}
        label="Github Handle"
        placeholder={"github.com/saronkiflu"}
        description={"You can see your github handle here"}
      />
      <TextArea
        className={"mt-2"}
        label="Bio"
        placeholder={"growing"}
        description={
          "You can @mention othr users and organizations to link to them"
        }
        height="141px"
      />
      <div>
        <Input
          className={"mt-2"}
          label="Social Accounts"
          placeholder={"link to social profile one"}
          description={"You can see your github handle here"}
        />
        <Button className={"px-4 font-normal mt-2 "} variant="base">
          Add
        </Button>
      </div>
      <div className="flex gap-2 mt-5">
        <Button className={"px-16"} variant="primary">
          Save
        </Button>
        <Button className={"px-16"} variant="base">
          cancel
        </Button>
      </div>
    </>
  );
}
