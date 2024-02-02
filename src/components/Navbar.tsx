"use client";

import { Users } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  function toggleDrawer() {
    const checkbox = document.getElementById("my-drawer") as HTMLInputElement;
    if (checkbox && checkbox.checked) {
      checkbox.checked = false;
    }
  }

  return (
    <div>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <TopBar />
        <div className="drawer-side z-10">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul
            className="menu min-h-full w-80 bg-base-200 p-4 text-base-content"
            onClick={toggleDrawer}
          >
            <li>
              <Link href={"/"}>
                <Users />
                Gerenciamento de usuários
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="drawer-content">
      <div className="navbar bg-base-100">
        <div className="flex-none">
          <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <div className="flex-1">
          <Link href={"/"} className="btn btn-ghost text-xl">
            Clinica
          </Link>
        </div>
      </div>
    </div>
  );
}
