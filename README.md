# Lensrace

> On-chain Follower Competitions on Lens Protocol

By [Dennis Zoma](https://twitter.com/dennis_zoma) 🧙‍♂️

## Getting Started

```bash
# Install pnpm
npm i -g pnpm

# Install dependencies
pnpm install

# Copy & fill environments
cp packages/frontend/.env.local.example packages/frontend/.env.local
cp packages/contracts/.env.example packages/contracts/.env
```

## Development

When developing in VSCode it's recommended to open within the workspace file located at `.vscode/*.code-workspace`. Also, install recommended plugins listed in `.vscode/extensions.json`.

```bash
# Generate contract-types, start local hardhat node, and start frontend with turborepo
pnpm dev

# Only start frontend
pnpm frontend:dev
```
