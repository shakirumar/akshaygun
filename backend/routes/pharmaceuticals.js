import express from 'express';

const router = express.Router();

// Pharmaceutical services information
const pharmaServices = {
  oncology: {
    name: 'Oncology & Anti-Cancer Drugs',
    description: 'Comprehensive cancer treatment medications',
    categories: [
      'Chemotherapy agents',
      'Targeted therapy drugs',
      'Immunotherapy medications',
      'Supportive care drugs',
      'Hormonal therapy agents'
    ]
  },
  cardiovascular: {
    name: 'Cardiovascular & Respiratory',
    description: 'Heart and respiratory disease management',
    categories: [
      'Heart disease medications',
      'Hypertension treatments',
      'Respiratory drugs',
      'Asthma medications',
      'Emergency cardiac care'
    ]
  },
  infectious: {
    name: 'Infectious Diseases',
    description: 'Treatment for infections and diseases',
    categories: [
      'Antibiotics',
      'Antivirals',
      'Anti-tubercular drugs',
      'HIV/AIDS treatments',
      'Antimalarial medications'
    ]
  },
  critical: {
    name: 'Critical Care',
    description: 'ICU and emergency medications',
    categories: [
      'ICU medications',
      'Sedatives & analgesics',
      'Infection management',
      'Organ support drugs',
      'Emergency medications'
    ]
  }
};

// Get all pharma services
router.get('/list', (req, res) => {
  res.json(pharmaServices);
});

// Get specific service category
router.get('/:category', (req, res) => {
  const category = req.params.category;
  if (pharmaServices[category]) {
    res.json(pharmaServices[category]);
  } else {
    res.status(404).json({ message: 'Service category not found' });
  }
});

// Emergency contact
router.post('/emergency-request', (req, res) => {
  try {
    const { medicineName, quantity, urgency, hospitalName, contactPerson, phone } = req.body;
    
    if (!medicineName || !phone) {
      return res.status(400).json({ message: 'Medicine name and phone number required' });
    }

    // In production, this would save to database and send notifications
    console.log('Emergency Request:', {
      medicineName,
      quantity,
      urgency,
      hospitalName,
      contactPerson,
      phone,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Emergency request received. Our team will contact you within 15 minutes.',
      requestId: `REQ-${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get certifications
router.get('/certifications/all', (req, res) => {
  res.json({
    certifications: [
      {
        name: 'WHO-GMP Certified',
        description: 'World Health Organization - Good Manufacturing Practice'
      },
      {
        name: 'Drug License',
        description: 'Government authorized pharmaceutical distributor'
      },
      {
        name: 'ISO 13485:2016',
        description: 'Medical device quality management system'
      },
      {
        name: 'Cold Chain Management',
        description: 'Temperature-controlled logistics for sensitive medications'
      }
    ]
  });
});

export default router;
