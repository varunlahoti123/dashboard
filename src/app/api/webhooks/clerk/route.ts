/**
 * Webhook handler for Clerk authentication events.
 * 
 * This endpoint receives webhook events from Clerk when user accounts are created or updated.
 * It verifies the webhook signature using SVIX and syncs user data to our database.
 * 
 * The handler:
 * 1. Validates the required CLERK_WEBHOOK_SECRET environment variable
 * 2. Extracts and validates the SVIX headers used for webhook verification
 * 3. Verifies the webhook payload signature using SVIX
 * 4. For user.created and user.updated events:
 *    - Extracts the user's email
 *    - Inserts/updates the user record in our database
 *    - Sets default role as 'user'
 * 
 * Security:
 * - Uses SVIX for webhook signature verification
 * - Requires valid CLERK_WEBHOOK_SECRET
 * - Validates all required SVIX headers
 */

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import type { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env')
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  const payload = await req.json() as Record<string, unknown>
  const webhook = new Webhook(WEBHOOK_SECRET)

  try {
    const evt = webhook.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const email = evt.data.email_addresses[0]?.email_address
      if (!email) throw new Error('User must have an email')
      
      await db.insert(users).values({
        clerkId: evt.data.id,
        email: email,
        role: 'user',
      }).onConflictDoUpdate({
        target: users.clerkId,
        set: {
          email: email,
        }
      })
    }

    return new Response('Success', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }
}