import express from 'express';
import { 
  getNetworkInfo,
  getAddressInfo, 
  getTransaction, 
  broadcastTransaction,
  buildTransaction,
  newWallet
} from '../polkadot';

const router = express.Router();

// GET /api/polkadot/network - Get network information
router.get('/network', async (req, res) => {
  try {
    const networkInfo = await getNetworkInfo();
    res.json({ success: true, data: networkInfo });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get network info',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/polkadot/address/:address - Get address information
router.get('/address/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const addressInfo = await getAddressInfo(address);
    res.json({ success: true, data: addressInfo });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get address info',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/polkadot/transaction/:hash - Get transaction by hash
router.get('/transaction/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const transaction = await getTransaction(hash);
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get transaction',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/polkadot/broadcast - Broadcast a signed transaction
router.post('/broadcast', async (req, res) => {
  try {
    const { transaction } = req.body;
    if (!transaction) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing transaction data' 
      });
    }
    
    const result = await broadcastTransaction(transaction);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to broadcast transaction',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/polkadot/build-transaction - Build a transaction
router.post('/build-transaction', async (req, res) => {
  try {
    const transaction = await buildTransaction();
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to build transaction',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/polkadot/new-wallet - Generate a new wallet
router.post('/new-wallet', async (req, res) => {
  try {
    const wallet = await newWallet();
    res.json({ success: true, data: wallet });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate new wallet',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
