const Store = require("../models/Store");
const Rating = require("../models/Rating");

const dashboard = async (req, res) => {
  try {
    const stores = await Store.find({ owner: req.user._id }).select("_id name");
    if (stores.length === 0) {
      return res.json({
        stores: [],
        averageRating: 0,
        ratings: []
      });
    }

    const storeIds = stores.map((store) => store._id);
    const ratings = await Rating.find({ store: { $in: storeIds } })
      .populate("user", "name email address")
      .populate("store", "name")
      .sort({ createdAt: -1 });

    const averageAgg = await Rating.aggregate([
      { $match: { store: { $in: storeIds } } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ]);

    const averageRating = averageAgg[0] ? Number(averageAgg[0].averageRating.toFixed(2)) : 0;

    const formattedRatings = ratings.map((item) => ({
      id: item._id,
      rating: item.rating,
      store: item.store,
      user: item.user,
      createdAt: item.createdAt
    }));

    return res.json({
      stores,
      averageRating,
      ratings: formattedRatings
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load owner dashboard", error: error.message });
  }
};

module.exports = {
  dashboard
};
