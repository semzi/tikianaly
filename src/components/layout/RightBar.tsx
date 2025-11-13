export const RightBar = () => {
  return (
     <div>
          <div className="flex flex-col gap-y-10">
            {/* News Section */}
            <ul className="block-style edge-lighting">
                <>
                  <p className="font-[500] flex items-center dark:text-snow-200 text-[#23272A]">
                    Latest News <img src="/fire.gif" className="w-5 ml-auto" alt="" />
                  </p>
                  <div className="flex text-neutral-n4 flex-col gap-y-3 mb-5">
                    <div className='image mt-4 w-full bg-[url("/assets/icons/mbape.png")] bg-cover bg-top h-32 rounded'></div>
                    <p className="sz-6 dark:text-white font-[500]">
                      Kylian Mbappe Scores third goal in UCL win
                    </p>
                    <div className="flex dark:text-snow-200 gap-2 sz-8 ">
                      <span>6 hours ago</span>
                      <span>|</span>
                      <span>6 mins read</span>
                    </div>
                  </div>
                  <div className="flex-col flex gap-5">
                    {/* single news column */}
                    <div className="flex border-y-1 dark:border-[#1F2937] border-snow-200 py-5 items-center gap-3 text-neutral-n4">
                      <div className='image w-50 bg-[url("/assets/icons/mbape.png")] bg-cover bg-center h-20 rounded'></div>
                      <div className="">
                        <p className="sz-8 dark:text-snow-200 font-[500]">
                          Kylian Mbappe Scores third goal in UCL win
                        </p>
                        <span className="sz-8 dark:text-white">
                          6 hours ago
                        </span>
                      </div>
                    </div>
                    {/* end of news col */}
                    {/* single news column */}
                    <div className="flex  items-center gap-3 text-neutral-n4">
                      <div className='image w-50 bg-[url("/assets/icons/mbape.png")] bg-cover bg-center h-20 rounded'></div>
                      <div>
                        <p className="sz-8 dark:text-snow-200 font-[500]">
                          Kylian Mbappe Scores third goal in UCL win
                        </p>
                        <span className="sz-8 dark:text-white">
                          6 hours ago
                        </span>
                      </div>
                    </div>
                    {/* end of news col */}
                  </div>
                </>
            </ul>

            {/* Download  Section */}
<div>
  <ul className="block-style">
    <p className="font-[500] dark:text-snow-200 mb-3 text-[#23272A]">
      Download our Mobile App
    </p>
    <div className="flex flex-col gap-3">
      <img src="\assets\icons\Group 1261157024.png" alt="" />
      <img
        src="\assets\icons\Frame 1261157588.png"
        className="cursor-pointer"
        alt=""
      />
      <img
        src="\assets\icons\Frame 1261157587.png"
        className="cursor-pointer"
        alt=""
      />
    </div>
  </ul>

  <div className="mt-7">
    <ul className="block-style edge-lighting">
      <p className="font-[500] dark:text-snow-200 mb-3 text-[#23272A]">
        Chat with our AI Buddy
      </p>
      <div className="flex flex-col gap-3">
        <img src="\assets\icons\Chat bot-bro 1.png" alt="" />
        <img
          src="\assets\icons\Secondary.png"
          className="cursor-pointer"
          alt=""
        />
      </div>
    </ul>
  </div>
</div>
          </div>
        </div>
  )
}

export default RightBar