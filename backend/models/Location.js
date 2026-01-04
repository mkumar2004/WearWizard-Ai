const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema(
  {
    locId: {
      type: String,
      required: true,
      unique: true
    },

    title: {
      type: String,
      required: true
    },

    subtitle: String,

    description: String,

    mainimage: String,

    Similarimages: {
      type: [String],
      default: []
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },

    reviewsCount: {
      type: Number,
      default: 0
    },

    category: {
      type: String,
      index: true
    },

    city: {
      type: String
    },

    state: String,

    country: {
      type: String,
      default: "India"
    },

    coordinates: {
      lat: Number,
      lng: Number
    },

    food: {
      name: String,
      price: Number,          // ✅ NUMBER ONLY
      image: [String]
    },

    nearbyLocations: [
      {
        name: String,
        distanceKm: Number,
        locId: String,
        image: [String]
      }
    ],

    bestTimeToVisit: String,

    entryFee: {
      type: Number,           // ✅ NUMBER ONLY
      default: 0
    },

    openingHours: String,

    isPopular: {
      type: Boolean,
      default: false
    },

    tags: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Location', LocationSchema);
