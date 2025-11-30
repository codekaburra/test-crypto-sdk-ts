import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';

// Import route modules
import evmRoutes from './routes/evm';
import cosmosRoutes from './routes/cosmos';
import polkadotRoutes from './routes/polkadot';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/evm', evmRoutes);
app.use('/api/cosmos', cosmosRoutes);
app.use('/api/polkadot', polkadotRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Crypto SDK API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 EVM API: http://localhost:${PORT}/api/evm`);
  console.log(`🌌 Cosmos API: http://localhost:${PORT}/api/cosmos`);
  console.log(`🔴 Polkadot API: http://localhost:${PORT}/api/polkadot`);
});

export default app;