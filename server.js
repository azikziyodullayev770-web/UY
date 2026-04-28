import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Payme / Click API Integration Stub
app.post('/api/pay', (req, res) => {
  const { amount, userId } = req.body;
  
  if (!amount || !userId) {
    return res.status(400).json({ error: "Missing amount or userId" });
  }

  console.log(`Processing payment request: User ${userId}, Amount ${amount} UZS`);

  // In a real production environment, you would call Payme or Click API here
  // For Payme, it usually involves generating a base64 encoded string of merchant details and user info
  
  // Example Payme Merchant ID
  const merchantId = '64352f754a6c8e32900c6d94'; 
  const tiyinAmount = amount * 100; // Payme uses tiyin (1/100 of sum)
  
  // Create account parameters (usually depends on your system, e.g., userId or orderId)
  const params = `m=${merchantId};ac.user_id=${userId};a=${tiyinAmount}`;
  
  // Base64 encoding as required by Payme
  const encodedParams = Buffer.from(params).toString('base64');
  
  // Resulting payment URL
  const payment_url = `https://checkout.paycom.uz/${encodedParams}`;

  // Return the URL to the frontend
  res.json({ 
    success: true,
    payment_url: payment_url,
    message: "Payment link generated successfully"
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\x1b[36m%s\x1b[0m`, `>>> Payment Backend running on http://localhost:${PORT}`);
  console.log(`\x1b[33m%s\x1b[0m`, `>>> API Endpoint: POST http://localhost:${PORT}/api/pay`);
});
