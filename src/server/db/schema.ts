// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  date,
  foreignKey,
} from "drizzle-orm/pg-core";
import { type InferSelectModel } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `dashboard_${name}`);


export const users = createTable(
  "user",
  {
    clerkId: varchar("clerk_id", { length: 256 }).primaryKey(),
    email: varchar("email", { length: 256 }).notNull(),
    role: varchar("role", { length: 32 }).default("user").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    clerkIdIndex: index("clerk_id_idx").on(table.clerkId),
    emailIndex: index("email_idx").on(table.email),
  })
);

// Enums
export const requestStatusEnum = pgEnum("request_status", [
  "pending",
  "in_progress",
  "completed",
  "failed",
  "cancelled",
]);

export const requestTypeEnum = pgEnum("request_type", [
  "medical_records",
  "billing",
  "images",
]);

export const priorityEnum = pgEnum("priority", ["normal", "urgent"]);

export const vendorRoutingEnum = pgEnum("vendor_routing", [
  "Datavant",
  "MRO",
  "HealthMark",
  "other",
]);

export const hipaaStatusEnum = pgEnum("hipaa_status", [
  "valid",
  "expired",
  "revoked",
]);

// Projects Table
export const projects = createTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("user_id", { length: 256 })
      .references(() => users.clerkId)
      .notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    organizationId: uuid("organization_id"),
    //Letter of Representation: States that Hermes has the right to request a record on behalf of the submitting entity
    letterRepresentationDocumentLocation: varchar("letter_representation_document_location", { length: 2048 }),
    //Request Letter: The letter states the purpose of the request to provide context to the provider
    requestLetterDocumentLocation: varchar("request_letter_document_location", { length: 2048 }),

  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    archivedAtIdx: index("archived_at_idx").on(table.archivedAt),
  })
);

// Record Requests Table
export const recordRequests = createTable(
  "record_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .references(() => projects.id)
      .notNull(),
    patientName: varchar("patient_name", { length: 256 }).notNull(),
    patientDob: date("patient_dob").notNull(),
    providerName: varchar("provider_name", { length: 256 }).notNull(),
    providerDetails: jsonb("provider_details").$type<{
      address: string;
      phone: string;
      fax: string;
    }>(),
    visitDateStart: date("visit_date_start").notNull(),
    visitDateEnd: date("visit_date_end").notNull(),
    status: requestStatusEnum("status"),
    requestType: requestTypeEnum("request_type"),
    priority: priorityEnum("priority"),
    vendorRouting: vendorRoutingEnum("vendor_routing"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true }),
    estimatedCompletionDate: date("estimated_completion_date"),
    notes: text("notes"),
    medicalRecordLocation: varchar("medical_record_location", { length: 2048 }),
  },
  (table) => ({
    projectIdIdx: index("project_id_idx").on(table.projectId),
    patientNameIdx: index("patient_name_idx").on(table.patientName),
    providerNameIdx: index("provider_name_idx").on(table.providerName),
  })
);

// HIPAA Authorizations Table
export const hipaaAuthorizations = createTable(
  "hipaa_authorizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recordRequestId: uuid("record_request_id").notNull(),
    projectId: uuid("project_id").notNull(),
    patientId: uuid("patient_id"),
    hipaaAuthorizationLocation: varchar("hipaa_authorization_location", { length: 2048 }),
    expirationDate: date("expiration_date"),
    status: hipaaStatusEnum("status"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => ({
    recordRequestIdIdx: index("record_request_id_idx").on(table.recordRequestId),
    expirationDateIdx: index("expiration_date_idx").on(table.expirationDate),
    recordRequestFk: foreignKey({
      columns: [table.recordRequestId],
      foreignColumns: [recordRequests.id],
      name: 'hipaa_record_request_fk'
    }),
    projectFk: foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: 'hipaa_project_fk'
    })
  })
);

// Export the inferred types
export type Project = InferSelectModel<typeof projects>;
export type RecordRequest = InferSelectModel<typeof recordRequests>;
export type InsertRecordRequest = typeof recordRequests.$inferInsert;


