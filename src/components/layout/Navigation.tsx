import { HomeIcon as HomeIconSolid } from "@heroicons/react/20/solid"
import { HomeIcon as HomeIconOutline } from "@heroicons/react/24/outline"
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"
import { UserCircleIcon as UserCircleIconOutline } from "@heroicons/react/24/outline"
import { UserCircleIcon as UserCircleIconSolid } from "@heroicons/react/24/solid"
import { BookOpenIcon as BookOpenIconOutline } from "@heroicons/react/24/outline"
import { BookOpenIcon as BookOpenIconSolid } from "@heroicons/react/24/solid"
import { TrophyIcon as TrophyIconOutline } from "@heroicons/react/24/outline"
import { TrophyIcon as TrophyIconSolid } from "@heroicons/react/24/solid"
import { UserGroupIcon as UserGroupIconOutline } from "@heroicons/react/24/outline"
import { UserGroupIcon as UserGroupIconSolid } from "@heroicons/react/24/solid"
import { NavLink } from "react-router-dom"

const Navigation = () => {
  return (
    <div className="flex md:hidden z-1000 justify-around backdrop-blur-lg px-2 fixed bottom-0 pt-3 pb-5 dark:bg-black/40 bg-white/50 w-full b">
            <NavLink to="/" className={({ isActive }) => `flex  dark:text-smoke-200 items-center flex-col relative${isActive ? ' text-brand-primary' : ''}` }>
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute top-[-10px] h-[2px] w-10 bg-brand-primary"></span>}
                    {isActive ? <HomeIconSolid className="h-7 w-7" /> : <HomeIconOutline className="text-neutral-n4 dark:text-smoke-200 h-7 w-7" />}
                    <p className="text-xs">Home</p>
                  </>
                )}
            </NavLink>
            <NavLink to="/league" className={({ isActive }) => `flex dark:text-smoke-200 items-center  flex-col relative${isActive ? ' text-brand-primary' : ''}` }>
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute top-[-10px] h-[2px] w-10 bg-brand-primary"></span>}
                    {isActive ? <TrophyIconSolid className="h-7 w-7" /> : <TrophyIconOutline className="text-neutral-n4 dark:text-smoke-200 h-7 w-7" />}
                    <p className="text-xs">Leagues</p>
                  </>
                )}
            </NavLink>
            <NavLink to="/news" className={({ isActive }) => `flex  dark:text-smoke-200 items-center flex-col relative${isActive ? ' text-brand-primary' : ''}` }>
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute top-[-10px] h-[2px] w-10 bg-brand-primary"></span>}
                    {isActive ? <BookOpenIconSolid className="h-7 w-7" /> : <BookOpenIconOutline className="text-neutral-n4 dark:text-smoke-200 h-7 w-7" />}
                    <p className="text-xs">News</p>
                  </>
                )}
            </NavLink>
            {/* <NavLink to="/community" className={({ isActive }) => `flex  dark:text-smoke-200 items-center flex-col relative${isActive ? ' text-brand-primary' : ''}` }>
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute top-[-10px] h-[2px] w-10 bg-brand-primary"></span>}
                    {isActive ? <UserGroupIconSolid className="h-7 w-7" /> : <UserGroupIconOutline className="text-neutral-n4 dark:text-smoke-200 h-7 w-7" />}
                    <p className="text-xs">Community</p>
                  </>
                )}
            </NavLink> */}
            {/* <NavLink to="/favourites" className={({ isActive }) => `flex  dark:text-smoke-200 items-center flex-col relative${isActive ? ' text-brand-primary' : ''}` }>
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute top-[-10px] h-[2px] w-10 bg-brand-primary"></span>}
                    {isActive ? <HeartIconSolid className="h-7 w-7" /> : <HeartIconOutline className="text-neutral-n4 dark:text-smoke-200 h-7 w-7" />}
                    <p className="text-xs">Favourite</p>
                  </>
                )}
            </NavLink> */}
            <NavLink to="/login" className={({ isActive }) => `flex  dark:text-smoke-200 items-center flex-col relative${isActive ? ' text-brand-primary' : ''}` }>
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute top-[-10px] h-[2px] w-10 bg-brand-primary"></span>}
                    {isActive ? <UserCircleIconSolid className="h-7 w-7" /> : <UserCircleIconOutline className="text-neutral-n4 dark:text-smoke-200 h-7 w-7" />}
                    <p className="text-xs">Profile</p>
                  </>
                )}
            </NavLink>
    </div>
  )
}

export default Navigation

