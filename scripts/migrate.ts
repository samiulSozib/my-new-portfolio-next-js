import { connect } from "./db";

// Applies the SQL migrations in ./drizzle. Safe to re-run: applied migrations are skipped.
const { migrate, kind, close } = await connect();
await migrate();
await close();
console.log(`Migrations applied (${kind}).`);
