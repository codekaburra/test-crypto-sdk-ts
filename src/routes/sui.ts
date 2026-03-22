import express from 'express';
import { getNetworkInfo, getAddressInfo } from '../sui';

const router = express.Router();

router.get('/network', async (req, res) => {
  try {
    const data = await getNetworkInfo();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get Sui network info',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/address/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const data = await getAddressInfo(address);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get Sui address info',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
