import { Download, FileText, LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { ProfileDocument } from "./profile-data";

export function ProfileDocuments({ documents }: { documents: ProfileDocument[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading font-medium text-base">Documents</h2>
        <Button size="sm">
          <FileText data-icon="inline-start" />
          Add document
        </Button>
      </div>

      <Table aria-label="Documents attached to this contractor profile" className="border-y">
        <TableHeader className="[&_th]:h-8">
          <TableHead isRowHeader className="w-2/5">
            <span className="sr-only">Document</span>
          </TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Access</TableHead>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow id={document.id} key={document.id}>
              <TableCell className="font-medium">{document.name}</TableCell>
              <TableCell className="text-muted-foreground">{document.category}</TableCell>
              <TableCell className="text-muted-foreground">{document.updatedAt}</TableCell>
              <TableCell>
                <Badge className="rounded-sm" variant="outline">
                  {document.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {document.isRestricted ? (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs" title="Restricted">
                    <LockKeyhole aria-hidden="true" className="size-3.5" />
                    Restricted
                  </span>
                ) : (
                  <Button aria-label={`Download ${document.name}`} size="icon-sm" variant="ghost">
                    <Download />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
