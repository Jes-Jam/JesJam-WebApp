import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

const neonSQL = neon(process.env.DATABASE_URL!);

const db = drizzle(neonSQL, { schema });

export default db;