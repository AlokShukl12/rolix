const Store = require("../models/Store");
const Rating = require("../models/Rating");
const { parseSort, parsePagination } = require("../utils/queryHelpers");

const listStoresForUser = async (req, res) => {
  try {
    const filters = {};
    if (req.query.name) {
      filters.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.address) {
      filters.address = { $regex: req.query.address, $options: "i" };
    }

    const sort = parseSort(req.query, ["name", "address", "createdAt"], "name");
    const { page, limit, skip } = parsePagination(req.query);

    const [stores, total] = await Promise.all([
      Store.find(filters).sort(sort).skip(skip).limit(limit).lean(),
      Store.countDocuments(filters)
    ]);

    const storeIds = stores.map((store) => store._id);
    const [averageRatings, userRatings] = await Promise.all([
      Rating.aggregate([
        { $match: { store: { $in: storeIds } } },
        { $group: { _id: "$store", averageRating: { $avg: "$rating" } } }
      ]),
      Rating.find({ store: { $in: storeIds }, user: req.user._id }).select("store rating")
    ]);

    const averageMap = averageRatings.reduce((acc, item) => {
      acc[item._id.toString()] = Number(item.averageRating.toFixed(2));
      return acc;
    }, {});
    const userRatingMap = userRatings.reduce((acc, item) => {
      acc[item.store.toString()] = item.rating;
      return acc;
    }, {});

    const data = stores.map((store) => ({
      ...store,
      overallRating: averageMap[store._id.toString()] ?? 0,
      userSubmittedRating: userRatingMap[store._id.toString()] ?? null
    }));

    return res.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to list stores", error: error.message });
  }
};

const submitOrUpdateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const updatedRating = await Rating.findOneAndUpdate(
      { store: storeId, user: req.user._id },
      { rating },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({
      message: "Rating saved successfully",
      rating: updatedRating
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save rating", error: error.message });
  }
};

module.exports = {
  listStoresForUser,
  submitOrUpdateRating
};
