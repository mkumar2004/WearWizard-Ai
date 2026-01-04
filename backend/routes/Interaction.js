const express = require('express');
const router = express.Router();
const LocationInteraction = require('../models/Interaction');


router.post('/like-toggle', async (req, res) => {
  try {
    const { userId, locationId } = req.body

    let interaction = await LocationInteraction.findOne({
      userId,
      locationId,
    })

    let liked

    if (!interaction) {
      interaction = await LocationInteraction.create({
        userId,
        locationId,
        liked: true,
      })
      liked = true
    } else {
      interaction.liked = !interaction.liked
      await interaction.save()
      liked = interaction.liked
    }

    const likeCount = await LocationInteraction.countDocuments({
      locationId,
      liked: true,
    })

    res.json({
      locationId,
      liked,
      likeCount,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.get('/likes/:locationId', async (req, res) => {
  try {
    const likes = await LocationInteraction.find({
      locationId: req.params.locationId,
      liked: true,
    })
      .populate('userId', 'username')
      .select('userId')

    res.json(likes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


router.post('/comment', async (req, res) => {
  try {
    const { userId, locationId, text } = req.body;

    const interaction = await LocationInteraction.findOneAndUpdate(
      { locationId },
      {
        $push: {
          comments: { userId, text },
        },
      },
      { upsert: true, new: true }
    ).populate('comments.userId', 'username');

    res.json(interaction.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/comments/:locationId', async (req, res) => {
  try {
    const interaction = await LocationInteraction.findOne({
      locationId: req.params.locationId,
    })
      .populate('comments.userId', 'username')
      .select('comments');

    res.json(interaction?.comments || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/stats/:locationId', async (req, res) => {
  const locationId = req.params.locationId;

  const likes = await LocationInteraction.countDocuments({
    locationId,
    liked: true
  });

  const shares = await LocationInteraction.countDocuments({
    locationId,
    shared: true
  });

  const comments = await LocationInteraction.aggregate([
    { $match: { locationId: new mongoose.Types.ObjectId(locationId) } },
    { $project: { count: { $size: '$comments' } } },
    { $group: { _id: null, total: { $sum: '$count' } } }
  ]);

  res.json({
    likes,
    shares,
    comments: comments[0]?.total || 0
  });
});


module.exports = router;
