import pg from 'pg';
const { Client } = pg;

const client = new Client({
    connectionString: "postgresql://postgres:your-super-secret-and-long-postgres-password@localhost:54322/postgres?sslmode=disable",
});

async function check() {
    try {
        await client.connect();
        console.log("Connected successfully!");
        const res = await client.query('SELECT NOW()');
        console.log("DB Time:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("Connection failed:", err);
    }
}

check();
