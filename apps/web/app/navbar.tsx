import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Navbar() {
  return (
  <> 
    <nav className="fixed top-0 left-0 z-50 w-max flex rounded-2xl items-center m-4 bg-[#0a1357] text-white group transition-all ease-in-out duration-400 border">
      <a href="/">
        <img
          className="h-10 md:hidden m-0 p-0"
          src="/brand/lt.svg"
          alt="LondonTransit Logo"
        />
        <img
          className="hidden md:block h-15 m-0 p-0"
          src="/brand/lt.svg"
          alt="LondonTransit Logo"
        />
      </a>
      <div className="max-w-0 space-x-2 md:group-hover:-ml-3 md:group-hover:mr-5 md:group-hover:max-w-[35vw] opacity-0 md:group-hover:opacity-100 transition-all duration-400 text-lg text-gray-200 overflow-hidden md:group-hover:px-2 leading-tight max-h-0 md:group-hover:max-h-[100px] line-clamp-1 hover:line-clamp-2">
        <a
          className="text-white hover:text-gray-300 hover:underline"
          href="/docs"
        >
          Documentation
        </a>
        <a
          className="text-white hover:text-gray-300 hover:underline"
          href="/faq"
        >
          FAQ
        </a>
        <a
          className="text-white hover:text-gray-300 hover:underline"
          href="/support"
        >
          Support
        </a>
      </div>
    </nav>
    <DropdownMenu>
      <DropdownMenuTrigger className="p-3 transition-colors duration-300 md:hidden fixed top-0 right-0 z-50 flex rounded-2xl items-center justify-center m-4 bg-[#0a1357] text-white group ease-in-out h-10 w-10 border">
          <FontAwesomeIcon icon={faBars} className="text-white text-xl" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-[#0a1357] text-white rounded-lg shadow-lg m-4 scroll-m-1">
          <ul>
            <li className="p-2 hover:bg-[#0a1357] hover:text-gray-300">
              <a href="/docs" className="text-white hover:underline">Documentation</a>
            </li>
            <li className="p-2 hover:bg-[#0a1357] hover:text-gray-300">
              <a href="/faq" className="text-white hover:underline">FAQ</a>
            </li>
            <li className="p-2 hover:bg-[#0a1357] hover:text-gray-300">
              <a href="/support" className="text-white hover:underline">Support</a>
            </li>
          </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
  );
}