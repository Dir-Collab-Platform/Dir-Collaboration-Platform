function LangBar() {
    return (
        <div className="bar relative rounded-2xl h-3.25">
            {/* create component for each lang and pass it the color and width */}
            <div className="lang3 h-full absolute bg-blue-700 w-full rounded-2xl"></div>
            <div className="lang2 h-full absolute bg-green-800 w-[73%] rounded-2xl"></div>
            <div className="lang1 h-full absolute bg-yellow-300 w-[48%] rounded-2xl"></div>
        </div>
    )
}

export default function LanguageStatsBar() {
    return (
        <div className=" flex flex-col gap-3">
            <LangBar />
            <div className="stats flex flex-col gap-1">
                <div className="lang1 flex items-center gap-2">
                    <span className="clr rounded-full size-3.25 bg-yellow-300"></span>
                    <p className="font-bold">JavaScript</p>
                    <p>50.3%</p>
                </div>

                <div className="lang2 flex items-center gap-2">
                    <span className="clr rounded-full size-3.25 bg-green-800"></span>
                    <p className="font-bold">CSS</p>
                    <p>33.4%</p>
                </div>

                <div className="lang3 flex items-center gap-2">
                    <span className="clr rounded-full size-3.25 bg-blue-700"></span>
                    <p className="font-bold">HTML</p>
                    <p>16.3%</p>
                </div>
            </div>
        </div>
    )
}