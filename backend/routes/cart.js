const router = require('express').Router();
const Cart = require('../models/Cart');
const Item = require('../models/items');

// Get user's cart
router.get('/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId })
            .populate('items.itemId');
        
        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: [], total: 0 });
            await cart.save();
        }
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add item to cart
router.post('/add', async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;

        if (!userId || !itemId || !quantity) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                received: { userId, itemId, quantity }
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ 
                userId,
                items: [],
                total: 0
            });
        }

        // Check if item already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.itemId.toString() === itemId
        );

        if (existingItemIndex > -1) {
            // Update existing item quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({ itemId, quantity });
        }

        // Calculate new total
        const populatedCart = await cart.populate('items.itemId');
        cart.total = populatedCart.items.reduce((total, item) => {
            return total + (item.itemId.price * item.quantity);
        }, 0);

        await cart.save();
        res.status(201).json(cart);

    } catch (error) {
        console.error('Cart add error:', error);
        res.status(500).json({ 
            message: 'Error adding item to cart',
            error: error.message
        });
    }
});

// Update cart item quantity
router.put('/update/:userId/:itemId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ userId: req.params.userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItem = cart.items.find(item => 
            item.itemId.toString() === req.params.itemId
        );

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Check stock
        const item = await Item.findById(req.params.itemId);
        if (item.stockQuantity < quantity) {
            return res.status(400).json({ message: 'Not enough stock' });
        }

        cartItem.quantity = quantity;

        // Update total
        const populatedCart = await cart.populate('items.itemId');
        cart.total = populatedCart.items.reduce((total, cartItem) => {
            return total + (cartItem.itemId.price * cartItem.quantity);
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove item from cart
router.delete('/remove/:userId/:itemId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            item.itemId.toString() !== req.params.itemId
        );

        // Update total
        const populatedCart = await cart.populate('items.itemId');
        cart.total = populatedCart.items.reduce((total, cartItem) => {
            return total + (cartItem.itemId.price * cartItem.quantity);
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;