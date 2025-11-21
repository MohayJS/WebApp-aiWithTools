const { spawn } = require('child_process');

// Path to the actual MCP server script
const serverScript = 'C:/xampp/htdocs/mcp-database-server/dist/src/index.js';

// Construct arguments using environment variables
const args = [
    serverScript,
    '--mysql',
    '--host', process.env.DB_HOST,
    '--database', process.env.DB_DATABASE,
    '--port', process.env.DB_PORT,
    '--user', process.env.DB_USER,
    '--password', process.env.DB_PASSWORD
];

// Spawn the server process inheriting stdio so MCP communication works
const child = spawn(process.execPath, args, {
    stdio: 'inherit'
});

child.on('exit', (code) => {
    process.exit(code);
});

child.on('error', (err) => {
    console.error('Failed to start MCP server:', err);
    process.exit(1);
});
