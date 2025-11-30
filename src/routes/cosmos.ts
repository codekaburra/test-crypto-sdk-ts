import express from 'express';
import { 
  getAddressInfo, 
  getTransaction, 
  broadcastTransaction
} from '../cosmos/rpc';

const router = express.Router();

// GET /api/cosmos/address/:address - Get address information
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

// GET /api/cosmos/transaction/:hash - Get transaction by hash
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

// POST /api/cosmos/broadcast - Broadcast a signed transaction
router.post('/broadcast', async (req, res) => {
  try {
    const { txBytes } = req.body;
    if (!txBytes) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing txBytes data' 
      });
    }
    
    const result = await broadcastTransaction(txBytes);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to broadcast transaction',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
