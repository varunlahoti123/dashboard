DO $$ BEGIN
 CREATE TYPE "public"."hipaa_status" AS ENUM('valid', 'expired', 'revoked');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."priority" AS ENUM('normal', 'urgent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."request_status" AS ENUM('pending', 'in_progress', 'completed', 'failed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."request_type" AS ENUM('medical_records', 'billing', 'images');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."vendor_routing" AS ENUM('Datavant', 'MRO', 'HealthMark', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dashboard_hipaa_authorizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"record_request_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"patient_id" uuid,
	"hipaa_authorization_location" varchar(2048),
	"expiration_date" date,
	"status" "hipaa_status",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dashboard_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"organization_id" uuid,
	"letter_representation_document_location" varchar(2048),
	"request_letter_document_location" varchar(2048)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dashboard_record_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"patient_name" varchar(256) NOT NULL,
	"patient_dob" date NOT NULL,
	"provider_name" varchar(256) NOT NULL,
	"provider_details" jsonb,
	"visit_date_start" date NOT NULL,
	"visit_date_end" date NOT NULL,
	"status" "request_status",
	"request_type" "request_type",
	"priority" "priority",
	"vendor_routing" "vendor_routing",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"last_activity_at" timestamp with time zone,
	"estimated_completion_date" date,
	"notes" text,
	"medical_record_location" varchar(2048)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dashboard_user" (
	"clerk_id" varchar(256) PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"role" varchar(32) DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dashboard_hipaa_authorizations" ADD CONSTRAINT "hipaa_record_request_fk" FOREIGN KEY ("record_request_id") REFERENCES "public"."dashboard_record_requests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dashboard_hipaa_authorizations" ADD CONSTRAINT "hipaa_project_fk" FOREIGN KEY ("project_id") REFERENCES "public"."dashboard_projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dashboard_projects" ADD CONSTRAINT "dashboard_projects_user_id_dashboard_user_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dashboard_user"("clerk_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dashboard_record_requests" ADD CONSTRAINT "dashboard_record_requests_project_id_dashboard_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."dashboard_projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "record_request_id_idx" ON "dashboard_hipaa_authorizations" USING btree ("record_request_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "expiration_date_idx" ON "dashboard_hipaa_authorizations" USING btree ("expiration_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "dashboard_projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "archived_at_idx" ON "dashboard_projects" USING btree ("archived_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_id_idx" ON "dashboard_record_requests" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patient_name_idx" ON "dashboard_record_requests" USING btree ("patient_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "provider_name_idx" ON "dashboard_record_requests" USING btree ("provider_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clerk_id_idx" ON "dashboard_user" USING btree ("clerk_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "dashboard_user" USING btree ("email");