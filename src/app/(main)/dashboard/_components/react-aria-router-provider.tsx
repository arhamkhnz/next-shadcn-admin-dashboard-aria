"use client";

import type { ReactNode } from "react";

import { useRouter } from "next/navigation";

import { RouterProvider } from "react-aria-components";

export function ReactAriaRouterProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return <RouterProvider navigate={(href) => router.push(href.toString())}>{children}</RouterProvider>;
}
