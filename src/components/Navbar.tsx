"use client";

import logo from "@/assets/logo.png";
import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ClerkUserButton from "./ClerkUserButton";
import ClinicSelector from "./ClinicSelector";

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
          <div
            className="menu flex min-h-full w-80 justify-between bg-secondary p-4 text-base-content"
            onClick={toggleDrawer}
          >
            <ul>
              <li>
                <Link href={"/"}>
                  <Users />
                  <p>Gerenciamento de usuários</p>
                </Link>
              </li>
            </ul>
            <div
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ClinicSelector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="drawer-content">
      <div className="navbar bg-secondary">
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
        <div className="flex w-full items-center justify-between pr-0 md:pr-6">
          <Link
            href={"/"}
            className="btn btn-ghost btn-lg ml-0 flex items-center justify-between pl-0 text-xl md:pl-4"
          >
            <Image src={logo} alt="logo" width={50} height={50} />
            <p>Clínica</p>
          </Link>
          <div className="flex items-center">
            <ClerkUserButton />
          </div>
        </div>
      </div>
    </div>
  );
}
