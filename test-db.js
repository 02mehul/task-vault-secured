import pg from 'pg';
const { Client } = pg;

const client = new Client({
    connectionString: "postgresql://authenticator:postgres123@127.0.0.1:54322/postgres?sslmode=disable"
});

async function test() {
    try {
        await client.connect();
        console.log("Connected successfully as authenticator!");
        const res = await client.query('SELECT 1');
        console.log("Query success:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("Connection failed as authenticator:", err.message);
        process.exit(1);
    }
}

test();
