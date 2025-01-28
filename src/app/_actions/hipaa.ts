"use server"

import { auth } from "@clerk/nextjs/server";
import { getHipaaAuthorizationByRequestId } from "@/server/db/queries";
import { cache } from "react";

export const getHipaaAuth = cache(async (requestId: string) => {
  return Promise.resolve().then(async () => {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    return getHipaaAuthorizationByRequestId(requestId);
  });
}); 