const router = require('express').Router();
const Rating = require('../models/rating');

// Get all ratings for an item
router.get('/item/:itemId', async (req, res) => {
  try {
    const ratings = await Rating.find({ itemId: req.params.itemId })
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a rating
router.post('/add', async (req, res) => {
  try {
    const { userId, itemId, rating, feedback } = req.body;
    
    // Check if user already rated this item
    const existingRating = await Rating.findOne({ userId, itemId });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this item' });
    }

    const newRating = new Rating({
      userId,
      itemId,
      rating,
      feedback
    });

    const savedRating = await newRating.save();
    const populatedRating = await Rating.findById(savedRating._id)
      .populate('userId', 'firstName lastName');
    
    res.status(201).json(populatedRating);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a rating
router.put('/update/:id', async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const updatedRating = await Rating.findByIdAndUpdate(
      req.params.id,
      { rating, feedback },
      { new: true }
    ).populate('userId', 'firstName lastName');
    
    res.json(updatedRating);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a rating
router.delete('/delete/:id', async (req, res) => {
  try {
    await Rating.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;