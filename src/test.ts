import { pool } from "./config/db";

async function test() {
  try {
    const [rows] = await (pool as any).execute("SELECT 1");
    console.log("DB OK:", rows);
  } catch (err) {
    console.error("DB ERROR:", err);
  }
}

test();
