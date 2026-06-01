# Agent Context

This project is a Next.js 16 application. When assisting with this codebase, please adhere to the following:

## Tech Stack & Conventions
- **Router**: Always use the App Router (`app/` directory).
- **State Management**: Utilize Server Actions for mutations and `React.use()` for unwrapping dynamic APIs.
- **Next.js 16 Features**: 
    - Use the built-in MCP server for diagnostics via `/_next/mcp`.
    - Follow async patterns for `cookies()`, `headers()`, and `params`.
    - Prefer `next-devtools-mcp` for real-time application state queries.

## Cryptography
- Use `@noble/curves` for elliptic curve operations (ECDSA, EdDSA).
- Use `@noble/hashes` for hashing (SHA2, SHA3, BLAKE).
- Always target algorithmic constant-time implementations where possible.

## AI Assistance
The project includes an MCP configuration in `.mcp.json`. Use the `get_errors` and `get_routes` tools to understand the current application state before suggesting fixes.