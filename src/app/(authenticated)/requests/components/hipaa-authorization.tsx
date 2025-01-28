"use client"

import { getHipaaAuth } from "@/app/_actions/hipaa";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { hipaaAuthorizations } from "@/server/db/schema";

export function HipaaAuthorization({ requestId }: { requestId: string }) {
  const [hipaa, setHipaa] = useState<typeof hipaaAuthorizations.$inferSelect | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHipaa = async () => {
      try {
        const data = await getHipaaAuth(requestId);
        setHipaa(data ?? null);
      } catch (error) {
        console.error('Error fetching HIPAA:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchHipaa();
  }, [requestId]);

  if (loading) return <HipaaAuthorizationSkeleton />;
  if (!hipaa) return <div className="text-sm text-muted-foreground">No HIPAA authorization found</div>;

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500">HIPAA Authorization</p>
      <div className="text-sm">
        <p>Status: {hipaa.status}</p>
        {hipaa.expirationDate && (
          <p>Expires: {new Date(hipaa.expirationDate).toLocaleDateString()}</p>
        )}
        {hipaa.hipaaAuthorizationLocation && (
          <a 
            href={hipaa.hipaaAuthorizationLocation}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Document
          </a>
        )}
      </div>
    </div>
  );
}

export function HipaaAuthorizationSkeleton() {
  return <Skeleton className="h-20 w-full" />;
} 