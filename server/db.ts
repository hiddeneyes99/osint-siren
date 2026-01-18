import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const DATABASE_URL = "postgresql://postgres.vytalqidugybpybcnzbk:NswtD6HN9Ysl9Ny8@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });
