import express from 'express';
import { 
  getNetworkInfo, 
  getAddressInfo, 
  getTransaction, 
  broadcastTransaction,
  buildTransaction
} from '../evm/evm';

const router = express.Router();

// GET /api/evm/network - Get network information
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

// GET /api/evm/address/:address - Get address information
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

// GET /api/evm/transaction/:hash - Get transaction by hash
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

// POST /api/evm/broadcast - Broadcast a signed transaction
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

// POST /api/evm/build-transaction - Build a transaction
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

export default router;
