const mongoose = require('mongoose');

const SeasonalPlanSchema = new mongoose.Schema({
  seasonType: {
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter'],
    required: true
  },

  data: {
    type: Object,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 90
  }
});

module.exports = mongoose.model('SeasonalPlan', SeasonalPlanSchema);
