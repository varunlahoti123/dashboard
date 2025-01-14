import { clerkClient } from "@clerk/clerk-sdk-node";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

async function syncClerkUsers() {
  try {
    // Get all users from Clerk
    const clerkUsers = await clerkClient.users.getUserList();
    
    // Process each user
    for (const clerkUser of clerkUsers.data) {
      const userData = {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        // Default role to "user" if you're using roles
        role: "user",
      };

      // Upsert the user - insert if not exists, update if exists
      await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.clerkId,
          set: userData,
        });
    }

    console.log(`Successfully synced ${clerkUsers.data.length} users`);
  } catch (error) {
    console.error("Error syncing users:", error);
    throw error;
  }
}

// Replace the require.main check with direct execution
syncClerkUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export { syncClerkUsers };
