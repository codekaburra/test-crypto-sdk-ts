# Crypto SDK API Server

A multi-blockchain API server supporting EVM, Cosmos, and Polkadot networks. This project has been transformed from a CLI-based crypto SDK to a full-featured REST API server.

## Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
The server will start on http://localhost:3000

### Production
```bash
npm run build
npm start
```

## Features

- **Multi-blockchain support**: EVM (Ethereum), Cosmos, and Polkadot networks
- **REST API endpoints** for common blockchain operations
- **Address information** retrieval (balance, nonce, account details)
- **Transaction** querying and broadcasting
- **Network information** access
- **Wallet generation** (Polkadot)
- **Error handling** and proper HTTP status codes
- **CORS enabled** for frontend integration
- **Security headers** with Helmet.js
- **Request logging** with Morgan

## API Documentation

See [API.md](./API.md) for detailed endpoint documentation.

## Environment Variables

Create a `.env` file based on your needs:

```env
PORT=3000
NODE_ENV=development
PRIVATE_KEY_EVM=your_ethereum_private_key_here
POLKADOT_ADDRESS=your_polkadot_address_here
```

## Project Structure

```
src/
├── index.ts              # Main server file
├── routes/               # API route definitions
│   ├── evm.ts           # Ethereum/EVM routes
│   ├── cosmos.ts        # Cosmos routes
│   └── polkadot.ts      # Polkadot routes
├── evm/                 # EVM blockchain utilities
├── cosmos/              # Cosmos blockchain utilities
├── polkadot/            # Polkadot blockchain utilities
├── networks/            # Network configurations
└── utils/               # Shared utilities
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run start:prod` - Start with NODE_ENV=production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run fmt` - Format code with Prettier

## Transformation Notes

This project was successfully transformed from a TypeScript CLI template to a REST API server:

- ✅ Added Express.js server framework
- ✅ Created RESTful API endpoints for all blockchain operations
- ✅ Implemented proper error handling and HTTP status codes  
- ✅ Added security middleware (CORS, Helmet)
- ✅ Updated package.json scripts for server development
- ✅ Enhanced TypeScript configuration
- ✅ Created comprehensive API documentation
