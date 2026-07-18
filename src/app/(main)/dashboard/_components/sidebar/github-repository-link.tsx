"use client";

import Link from "next/link";

import { siGithub } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { buttonVariants } from "@/components/ui/button";

export function GitHubRepositoryLink() {
  return (
    <Link
      href="https://github.com/arhamkhnz/next-shadcn-admin-dashboard-baseui"
      target="_blank"
      rel="noreferrer"
      aria-label="Open GitHub repository"
      className={buttonVariants({ size: "icon" })}
    >
      <SimpleIcon icon={siGithub} className="fill-primary-foreground" />
    </Link>
  );
}
