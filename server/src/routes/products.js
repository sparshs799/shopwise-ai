/**
 * Products API Routes
 * Individual product details and operations
 * 
 * @author Sparsh Srivastava
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/products/:id
 * Get detailed information about a specific product
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Mock product detail - in production, fetch from database
    const product = {
      id,
      name: 'ASUS ROG Strix G16 Gaming Laptop',
      brand: 'ASUS',
      category: 'laptops',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
      description: 'High-performance gaming laptop with latest RTX graphics and cutting-edge cooling technology',
      specs: {
        cpu: 'Intel Core i9-13980HX',
        gpu: 'NVIDIA RTX 4070',
        ram: '32GB DDR5',
        storage: '1TB SSD',
        screen: '16-inch QHD 240Hz',
        weight: '2.5 kg',
        battery: '90Wh'
      },
      features: [
        'RGB Keyboard',
        'Advanced Cooling System',
        'Wi-Fi 6E',
        'Thunderbolt 4',
        'Windows 11 Pro'
      ],
      prices: [
        {
          store: 'Best Buy',
          storeSlug: 'bestbuy',
          price: 2299.99,
          originalPrice: 2599.99,
          discount: 12,
          inStock: true,
          stockLevel: 'In Stock',
          delivery: { available: true, price: 0, eta: '2-3 days' },
          pickup: { available: true, price: 0 },
          url: 'https://www.bestbuy.com'
        },
        {
          store: 'Amazon',
          storeSlug: 'amazon',
          price: 2249.99,
          originalPrice: 2599.99,
          discount: 13,
          inStock: true,
          stockLevel: 'Only 3 left',
          delivery: { available: true, price: 0, eta: '1-2 days' },
          pickup: { available: false },
          url: 'https://www.amazon.com'
        }
      ]
    };

    res.json({ success: true, product });

  } catch (error) {
    console.error('Product detail error:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

/**
 * GET /api/products/:id/similar
 * Get similar products based on specs and category
 */
router.get('/:id/similar', async (req, res) => {
  try {
    // Mock similar products
    const similar = [
      {
        id: 'similar-1',
        name: 'MSI Raider GE78HX',
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
        price: 3799.99,
        specs: { gpu: 'RTX 4090', ram: '64GB' }
      },
      {
        id: 'similar-2',
        name: 'Lenovo Legion Pro 7i',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
        price: 2699.99,
        specs: { gpu: 'RTX 4080', ram: '32GB' }
      }
    ];

    res.json({ success: true, similar });

  } catch (error) {
    console.error('Similar products error:', error);
    res.status(500).json({ error: 'Failed to fetch similar products' });
  }
});

module.exports = router;
