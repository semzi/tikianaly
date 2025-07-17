import { HomeIcon } from "@heroicons/react/20/solid"
import { HeartIcon } from "@heroicons/react/24/outline"
import { UserCircleIcon } from "@heroicons/react/24/outline"
import { BookOpenIcon } from "@heroicons/react/24/outline"
import { TrophyIcon } from "@heroicons/react/24/outline"

const Navigation = () => {
  return (
    <div className="flex justify-around backdrop-blur-lg px-2 fixed bottom-0 pt-3 pb-5 bg-white/30 w-full b">
            <div className="flex text-brand-primary items-center flex-col">
                <HomeIcon className="h-7 w-7" />
                <p className="text-xs">Home</p>
            </div>
            <div className="flex items-center flex-col">
                <TrophyIcon className="h-7 w-7" />
                <p className="text-xs">Leagues</p>
            </div>
            <div className="flex items-center flex-col">
                <BookOpenIcon className="h-7 w-7" />
                <p className="text-xs">News</p>
            </div>
            <div className="flex items-center flex-col">
                <HeartIcon className="h-7 w-7" />
                <p className="text-xs">Favourite</p>
            </div>
            <div className="flex items-center flex-col">
                <UserCircleIcon className="h-7 w-7" />
                <p className="text-xs">Profile</p>
            </div>
    </div>
  )
}

export default Navigation

