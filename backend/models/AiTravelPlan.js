const mongoose = require("mongoose");

/* Activities inside each day */
const ActivitySchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
      trim: true
    },
    activity: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    transport: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

/* Day-wise itinerary */
const DayWiseItinerarySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    activities: {
      type: [ActivitySchema],
      required: true,
      validate: {
        validator: v => Array.isArray(v) && v.length > 0,
        message: "Each day must contain at least one activity"
      }
    }
  },
  { _id: false }
);

/* Top attractions */
const TopAttractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    Time: {
      type: String,
      required: true,
      trim: true
    },
    Price: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

/* Main travel plan schema */
const TravelPlanSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      required: true,
      trim: true
    },
    travelStyle: {
      type: String,
      required: true,
      trim: true
    },
    bestTimeToVisit: {
      type: String,
      required: true,
      trim: true
    },
    overview: {
      type: String,
      required: true,
      trim: true
    },
    costperday: {
      type: Number,
      required: true,
      min: 0
    },

    dayWiseItinerary: {
      type: [DayWiseItinerarySchema],
      required: true,
      validate: {
        validator: v => Array.isArray(v) && v.length > 0,
        message: "dayWiseItinerary must not be empty"
      }
    },

    topAttractions: {
      type: [TopAttractionSchema],
      required: true,
      validate: {
        validator: v => Array.isArray(v) && v.length > 0,
        message: "topAttractions must not be empty"
      }
    },

    localFoodsToTry: {
      type: [String],
      required: true,
      validate: {
        validator: v => Array.isArray(v) && v.length > 0,
        message: "localFoodsToTry must not be empty"
      }
    },

    transportTips: {
      type: [String],
      required: true,
      validate: {
        validator: v => Array.isArray(v) && v.length > 0,
        message: "transportTips must not be empty"
      }
    },

    staySuggestions: {
      type: String,
      required: true,
      trim: true
    },

    estimatedBudget: {
      type: String,
      required: true,
      trim: true
    },

    travelTips: {
      type: [String],
      required: true,
      validate: {
        validator: v => Array.isArray(v) && v.length > 0,
        message: "travelTips must not be empty"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("TravelPlan", TravelPlanSchema);


