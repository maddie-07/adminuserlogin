import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
  throw new Error('Missing required environment variables');
}

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: false, // Disable SSL for local development
});

// Function to execute queries with generic result type
export async function doQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const result: any = await sql.unsafe(query, params);
    return result as T[]; // Cast result to the expected type
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// Example function to get PostgreSQL version (using the doQuery function)
export async function getPgVersion(): Promise<void> {
  const query = 'SELECT version()';
  const result = await doQuery<{ version: string }>(query);
  console.log(result);
}

// Function to get all records from the 'users' table
export async function getUsers(): Promise<void> {
  const query = 'SELECT * FROM admins';
  try {
    const users = await doQuery(query);
    console.log(users); // Output the retrieved users
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// Call the getUsers function to test database access
getUsers().then(() => console.log('Finished retrieving users')).catch(console.error);
