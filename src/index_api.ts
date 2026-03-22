import { createExpressApp, applyErrorHandlers } from './app';
import evmRoutes from './routes/evm';
import cosmosRoutes from './routes/cosmos';
import polkadotRoutes from './routes/polkadot';
import suiRoutes from './routes/sui';

const app = createExpressApp();

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/evm', evmRoutes);
app.use('/api/cosmos', cosmosRoutes);
app.use('/api/polkadot', polkadotRoutes);
app.use('/api/sui', suiRoutes);

applyErrorHandlers(app);

export default app;
export { applyErrorHandlers };
