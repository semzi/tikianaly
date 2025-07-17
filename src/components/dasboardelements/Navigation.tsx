import { HomeIcon } from "@heroicons/react/20/solid"
import { UserCircleIcon } from "@heroicons/react/24/outline"
import { BookOpenIcon } from "@heroicons/react/24/outline"
import { TrophyIcon } from "@heroicons/react/24/outline"

const Navigation = () => {
  return (
    <div className="flex justify-around backdrop-blur-lg fixed bottom-0 pt-3 pb-5 bg-white/30 w-full b">
            <HomeIcon className="h-7 w-7" />
            <TrophyIcon className="h-7 w-7" />
            <BookOpenIcon className="h-7 w-7" />
            <UserCircleIcon className="h-7 w-7" />
    </div>
  )
}

export default Navigation

