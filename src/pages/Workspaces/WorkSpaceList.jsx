import { ChevronDown, Search } from "lucide-react";
import Button from "../../common-components/button";
import WorkSpacesSlot from "./WorkSpacesSlot";

const MockData = [
  {
    projectName: "E-Commerce",
    visibility: "public",
    description:
      "A simple e-commerce frontend with cart, filters and checkout UI",
    stars: 7,
    updatedAt: "updated yesterday",
    contributors: [
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/women/68.jpg",
      "https://randomuser.me/api/portraits/men/75.jpg",
    ],
  },
  {
    projectName: "Mini-Git",
    visibility: "public",
    description:
      "A simple e-commerce frontend with cart, filters and checkout UI",
    stars: 7,
    updatedAt: "updated yesterday",
    contributors: [
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/women/44.jpg",
    ],
  },
  {
    projectName: "Database",
    visibility: "public",
    description:
      "A simple e-commerce frontend with cart, filters and checkout UI",
    stars: 7,
    updatedAt: "updated yesterday",
    contributors: ["https://randomuser.me/api/portraits/men/32.jpg"],
  },
];

export default function WorkSpaceList() {
  return (
    <>
      <div className="flex w-full items-center gap-5">
        <div className="flex w-5/6 items-center">
          <div className="relative flex flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for repositories..."
              className="flex-1 bg-[#303036] border border-[#EFEEEE21] pl-12 py-2.5 rounded-l-xl"
            />
          </div>

          <Button variant="primary" className="py-2.5 px-6 rounded-r-xl">
            Search
          </Button>
        </div>

        <div className="w-1/6">
          <Button
            variant="base"
            className="w-full flex justify-center items-center py-2.5 rounded-xl gap-2"
          >
            <ChevronDown />
            <span>Sort</span>
          </Button>
        </div>
      </div>

      <div className="rounded-xl bg-[#1A1A1E] my-4 flex flex-col items-center justify-center border border-white/10">
        {MockData.map((project) => (
          <WorkSpacesSlot
            projectName={project.projectName}
            visibility={project.visibility}
            description={project.description}
            stars={project.stars}
            contributors={project.contributors}
            updatedAt={project.updatedAt}
          />
        ))}
        <Button variant="primary" className={"px-12 py-2 rounded-lg my-2"}>
          Load More
        </Button>
      </div>
    </>
  );
}
