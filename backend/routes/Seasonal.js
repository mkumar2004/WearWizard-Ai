const User = require('../models/User');
const express = require('express');
const SeasonalPlan = require('../models/SeasonalPlan');

const router = express.Router();

router.get('/Season/:type', async (req, res) => {
  const { type } = req.params;

  const data = await SeasonalPlan.findOne({ seasonType: type })
    .sort({ createdAt: -1 });

  if (!data) {
    return res.status(404).json({ message: "Season not found" });
  }

  res.json({
    success: true,
    data
  });
});

router.get('/SeasonalData', async (req, res) => {
  try {
    const { _id } = req.query;

    if (!_id) {
      return res.status(400).json({ message: 'UserId required' });
    }

    const user = await User.findById(_id);

    if (!user) {
      return res.status(400).json({ message: 'UserId Invalid' });
    }

    const Locdata = await SeasonalPlan.find();

    res.status(200).json({
      success: true,
      Locdata,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});


module.exports = router;
