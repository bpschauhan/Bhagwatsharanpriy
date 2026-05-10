"use client";

import { useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <AdminHeader title="Admin workspace unavailable" description="The internal system could not complete this request." />
      <Card>
        <CardContent className="p-6">
          <p className="leading-8 text-foreground/72">No content was changed. Please retry when the connection is stable.</p>
          <button type="button" className="focus-ring-calm mt-5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={reset}>
            Try again
          </button>
        </CardContent>
      </Card>
    </>
  );
}
