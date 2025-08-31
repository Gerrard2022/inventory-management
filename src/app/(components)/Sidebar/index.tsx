"use client";

import { Menu } from "lucide-react";

const Sidebar = () => {
  return (
    <div>
        <div className="flex justify-between md:justify-normal items-center pt-8">
            <div className="">logo</div>
            <h1 className="font-extrabold text-2xl">iStock</h1>
       
            <button className="md:hidden p-3 bg-gray-100 rounded-full hover:bg-blue-100" onClick={() => {}}>
                <Menu className="w-4 h-4" />
            </button>
       </div>

       {/* LINKS */}
        <div className="flex-grow mt-8">
            {/* LINKS HERE */}
        </div>

        {/* Footer */}
        <div className="">
            <p className="text-center text-xs text-gray-500">&copy; 2025 iStock</p>
        </div>
    </div>
  )
}

export default Sidebar