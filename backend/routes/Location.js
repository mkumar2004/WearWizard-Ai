const express = require('express');
const Locationdata = require('../models/Location');
const User = require('../models/User');
const router = express.Router();

router.post('/Location', async (req, res) => {
  try {
    const { _id, lastId = null, limit = 10 } = req.body

    const user = await User.findById(_id)
    if (!user) {
      return res.status(400).json({ message: 'UserId Invalid' })
    }

    const query = lastId
      ? { _id: { $gt: lastId } }
      : {}

    const Locdata = await Locationdata.find(query)
      .sort({ _id: 1 })           
      .limit(parseInt(limit))

    const hasMore = Locdata.length === parseInt(limit)

    res.status(200).json({
      success: true,
      Locdata,
      pagination: {
        lastId: Locdata.length
          ? Locdata[Locdata.length - 1]._id
          : lastId,
        hasMore,
        limit: parseInt(limit),
      },
    })
  } catch (error) {
    console.error('Location fetch error:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})


module.exports = router

