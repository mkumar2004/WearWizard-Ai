// const mongoose = require('mongoose');

// const LocationInteractionSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       index: true
//     },

//     locationId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Location',
//       required: true,
//       index: true
//     },

//     liked: {
//       type: Boolean,
//       default: false
//     },

//     comments: [
//       {
//         text: {
//           type: String,
//           required: true
//         },
//         createdAt: {
//           type: Date,
//           default: Date.now
//         }
//       }
//     ],

//     shared: {
//       type: Boolean,
//       default: false
//     }
//   },
//   { timestamps: true }
// );

// /* 🔒 One interaction per user per location */
// LocationInteractionSchema.index(
//   { userId: 1, locationId: 1 },
//   { unique: true }
// );

// module.exports = mongoose.model(
//   'LocationInteraction',
//   LocationInteractionSchema
// );
const mongoose = require('mongoose');

const LocationInteractionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
      index: true,
    },

    liked: {
      type: Boolean,
      default: false,
    },

    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    shared: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* 🔒 One interaction per user per location */
LocationInteractionSchema.index(
  { userId: 1, locationId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  'LocationInteraction',
  LocationInteractionSchema
);
