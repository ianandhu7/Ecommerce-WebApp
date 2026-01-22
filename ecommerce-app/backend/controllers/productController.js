// Product Controller
const Product = require('../models/Product');
const sequelize = require('../config/db');

const getAllProducts = async (req, res) => {
    try {
        const { gender } = req.query;

        let query = 'SELECT * FROM "Products"';
        let params = [];

        if (gender) {
            query += ' WHERE gender = $1';
            params.push(gender);
        }

        const [products] = await sequelize.query(query, {
            bind: params
        });

        res.json(products);
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const seedProducts = async (req, res) => {
    try {
        // First, delete all existing products
        await sequelize.query('DELETE FROM "Products"');

        // Reset the ID sequence if possible (for PostgreSQL)
        try {
            await sequelize.query('ALTER SEQUENCE "Products_id_seq" RESTART WITH 1');
        } catch (seqError) {
            console.log('Could not reset sequence, skipping...');
        }

        const productsData = [
            {
                name: 'Noir Tailored Wool Coat',
                brand: 'Balenciaga',
                price: 2850.00,
                image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80',
                category: 'Outerwear',
                gender: 'Women',
                description: 'An elegant, long, tailored black wool coat featuring a structured silhouette and dramatic lapels. Perfect for a high-fashion editorial look.'
            },
            {
                name: 'Oversized Puffer Jacket',
                brand: 'Vetements',
                price: 1950.00,
                image: '/puffer-jacket.avif',
                category: 'Outerwear',
                gender: 'Men',
                description: 'A massive, oversized padded puffer jacket in matte black. Features a high collar and dropped shoulders for a modern luxury street style aesthetic.'
            },
            {
                name: 'Monolith Leather Boots',
                brand: 'Prada',
                price: 1450.00,
                image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
                category: 'Shoes',
                gender: 'Women',
                description: 'Chunky, combat-inspired leather boots with a polished finish. These boots add a tough, utilitarian edge to any sophisticated outfit.'
            },
            {
                name: 'Sleek Leather Tote',
                brand: 'Saint Laurent',
                price: 2250.00,
                image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80',
                category: 'Accessories',
                gender: 'Unisex',
                description: 'A minimalist black leather tote bag with clean lines and subtle branding. The ultimate luxury accessory for the modern professional.'
            },
            {
                name: 'Quilted Leather Biker',
                brand: 'Burberry',
                price: 3200.00,
                image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80',
                category: 'Outerwear',
                gender: 'Women',
                description: 'A classic biker jacket reimagined with intricate quilting and premium lambskin leather. Features silver hardware and a cropped fit.'
            },
            {
                name: 'Cashmere Overcoat',
                brand: 'The Row',
                price: 4500.00,
                image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
                category: 'Outerwear',
                gender: 'Men',
                description: 'Pure cashmere overcoat in a deep charcoal black. Unstructured yet refined, offering unparalleled softness and warmth.'
            },
            {
                name: 'Combat Chelsea Boots',
                brand: 'Bottega Veneta',
                price: 1150.00,
                image: 'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80',
                category: 'Shoes',
                gender: 'Men',
                description: 'A modern hybrid of the classic Chelsea boot and a rugged combat boot. Features elastic side panels and a heavy lug sole.'
            },
            {
                name: 'Nappa Leather Gloves',
                brand: 'Gucci',
                price: 450.00,
                image: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&w=800&q=80',
                category: 'Accessories',
                gender: 'Unisex',
                description: 'Silk-lined nappa leather gloves. A timeless essential that provides both warmth and a touch of sophisticated elegance.'
            },
        ];

        // Create products one by one
        const created = [];
        for (const productData of productsData) {
            const product = await Product.create(productData);
            created.push(product);
        }

        // Verify count
        const [newCountResult] = await sequelize.query('SELECT COUNT(*) as count FROM "Products"');
        const newCount = parseInt(newCountResult[0].count);

        res.json({
            message: 'Luxury collection seeded successfully',
            count: created.length,
            verified: newCount
        });
    } catch (error) {
        console.error('Error in seedProducts:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get product suggestions for autocomplete
const getProductSuggestions = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim().length < 2) {
            return res.json([]);
        }

        const searchQuery = query.toLowerCase().trim();

        // Search products by name, brand, or category
        const sqlQuery = `
            SELECT id, name, brand, price, image, category, gender
            FROM "Products"
            WHERE 
                LOWER(name) LIKE $1 OR
                LOWER(brand) LIKE $1 OR
                LOWER(category) LIKE $1
            ORDER BY 
                CASE 
                    WHEN LOWER(name) LIKE $2 THEN 1
                    WHEN LOWER(brand) LIKE $2 THEN 2
                    ELSE 3
                END,
                name ASC
            LIMIT 6
        `;

        const [products] = await sequelize.query(sqlQuery, {
            bind: [`%${searchQuery}%`, `${searchQuery}%`]
        });

        res.json(products);
    } catch (error) {
        console.error('Error in getProductSuggestions:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    seedProducts,
    getProductSuggestions
};
