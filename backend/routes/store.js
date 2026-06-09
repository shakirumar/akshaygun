import express from 'express';

const router = express.Router();

// Get store information
router.get('/info', (req, res) => {
  res.json({
    storeName: 'Akshaygun Pharmaceuticals',
    address: '1712/19, Mangal Building - 2, Ground floor, Bhagirath palace Delhi - 110006',
    city: 'Delhi',
    state: 'Delhi',
    zipCode: '110006',
    phone: '+91-XXXXX-XXXXX',
    email: 'info@akshaygun.com',
    website: 'www.akshaygun.com',
    workingHours: {
      weekday: '10:00 AM - 8:00 PM',
      weekend: '10:00 AM - 8:00 PM',
    },
    about: 'Licensed Pharmaceutical Distributor - WHO-GMP Certified - Anti-Cancer Drugs & Life-Saving Medications',
  });
});

export default router;
