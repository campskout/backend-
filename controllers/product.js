const prisma = require('../database/prisma.js');

// Create a new product
const createProduct = async (req, res) => {
    const { title, description, price, category, imageUrl, userId } = req.body;

    if (!title || !description || !price || !category || !imageUrl || !userId) {
        return res.status(400).json({ status: 400, message: 'All fields are required' });
    }

    try {
        const product = await prisma.product.create({
            data: {
                title,
                description,
                price,
                category,
                imageUrl,
                user: { connect: { id: userId } },
            },
        });
        return res.status(201).json({ status: 201, data: product });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        return res.json({ status: 200, data: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

// Get a product by ID
// Get a product by ID
const getProductById = async (req, res) => {
    const productId = parseInt(req.params.id, 10);

    if (isNaN(productId) || productId <= 0) {
        return res.status(400).json({ status: 400, message: 'Invalid product ID' });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                user: true 
            }
        });

        if (!product) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        return res.json({ status: 200, data: product });
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const { title, description, price, category, imageUrl } = req.body;

    if (isNaN(productId) || productId <= 0 || !title || !description || !price || !category || !imageUrl) {
        return res.status(400).json({ status: 400, message: 'Invalid input' });
    }

    try {
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                title,
                description,
                price,
                category,
                imageUrl,
            },
        });

        return res.json({ status: 200, data: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    const productId = parseInt(req.params.id, 10);

    if (isNaN(productId) || productId <= 0) {
        return res.status(400).json({ status: 400, message: 'Invalid product ID' });
    }

    try {
        await prisma.product.delete({
            where: { id: productId },
        });

        return res.json({ status: 200, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
