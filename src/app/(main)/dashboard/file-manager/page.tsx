import { cn } from "cn";
import { FolderPlus, Grid2X2, List, Upload } from "lucide-react";

import { Button, LinkButton } from "@/components/ui/button";

import { type FileManagerView, files, folders } from "./_components/data";
import { FileGridView } from "./_components/file-grid-view";
import { FileListView } from "./_components/file-list-view";
import { FileManagerToolbar } from "./_components/file-manager-toolbar";
import { FoldersSection } from "./_components/folders-section";

interface PageProps {
  searchParams: Promise<{ view?: string | string[] }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { view } = await searchParams;
  const activeView: FileManagerView = view === "list" ? "list" : "grid";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">My files</h1>
          <p className="text-muted-foreground text-sm">Organize, share, and find workspace files.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FolderPlus data-icon="inline-start" />
            New folder
          </Button>
          <Button>
            <Upload data-icon="inline-start" />
            Upload
          </Button>
        </div>
      </div>
      <FileManagerToolbar />
      <FoldersSection folders={folders} />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-medium text-lg">All files</h2>
          <fieldset className="flex items-center border-0 p-0" aria-label="File view">
            <LinkButton
              href="?view=grid"
              variant="outline"
              size="sm"
              className={cn("rounded-r-none", activeView === "grid" && "bg-muted text-foreground")}
            >
              <Grid2X2 />
              Grid View
            </LinkButton>
            <LinkButton
              href="?view=list"
              variant="outline"
              size="sm"
              className={cn("-ml-px rounded-l-none", activeView === "list" && "bg-muted text-foreground")}
            >
              <List />
              List View
            </LinkButton>
          </fieldset>
        </div>
        {activeView === "list" ? <FileListView files={files} /> : <FileGridView files={files} />}
      </div>
    </div>
  );
}
