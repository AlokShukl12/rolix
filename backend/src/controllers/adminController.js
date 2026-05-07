const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");
const { ROLES } = require("../config/constants");
const { buildRegexFilters, parseSort, parsePagination } = require("../utils/queryHelpers");

const dashboard = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.countDocuments(),
      Store.countDocuments(),
      Rating.countDocuments()
    ]);

    return res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load dashboard", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      address,
      password,
      role: role || ROLES.USER
    });

    return res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create user", error: error.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const filters = buildRegexFilters(req.query, ["name", "email", "address"]);
    if (req.query.role && Object.values(ROLES).includes(req.query.role)) {
      filters.role = req.query.role;
    }
    const sort = parseSort(req.query, ["name", "email", "address", "role", "createdAt"], "name");
    const { page, limit, skip } = parsePagination(req.query);

    const [users, total] = await Promise.all([
      User.find(filters).sort(sort).skip(skip).limit(limit).select("name email address role"),
      User.countDocuments(filters)
    ]);

    return res.json({
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to list users", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("name email address role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let ownerRating = null;
    if (user.role === ROLES.OWNER) {
      const ownerStores = await Store.find({ owner: user._id }).select("_id");
      const ownerStoreIds = ownerStores.map((store) => store._id);
      if (ownerStoreIds.length > 0) {
        const ratingAgg = await Rating.aggregate([
          { $match: { store: { $in: ownerStoreIds } } },
          { $group: { _id: null, averageRating: { $avg: "$rating" } } }
        ]);
        ownerRating = ratingAgg[0] ? Number(ratingAgg[0].averageRating.toFixed(2)) : 0;
      } else {
        ownerRating = 0;
      }
    }

    return res.json({
      user,
      ownerRating
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const existing = await Store.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Store email already exists" });
    }

    let owner = null;
    if (ownerId) {
      owner = await User.findById(ownerId);
      if (!owner || owner.role !== ROLES.OWNER) {
        return res.status(400).json({ message: "ownerId must belong to a Store Owner user" });
      }
    }

    const store = await Store.create({
      name,
      email,
      address,
      owner: owner ? owner._id : null,
      createdBy: req.user._id
    });

    return res.status(201).json({
      message: "Store created",
      store
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create store", error: error.message });
  }
};

const listStores = async (req, res) => {
  try {
    const filters = buildRegexFilters(req.query, ["name", "email", "address"]);
    const sort = parseSort(req.query, ["name", "email", "address", "createdAt"], "name");
    const { page, limit, skip } = parsePagination(req.query);

    const [stores, total] = await Promise.all([
      Store.find(filters).sort(sort).skip(skip).limit(limit).lean(),
      Store.countDocuments(filters)
    ]);

    const storeIds = stores.map((store) => store._id);
    const averageRatings = await Rating.aggregate([
      { $match: { store: { $in: storeIds } } },
      { $group: { _id: "$store", averageRating: { $avg: "$rating" } } }
    ]);

    const averageMap = averageRatings.reduce((acc, item) => {
      acc[item._id.toString()] = Number(item.averageRating.toFixed(2));
      return acc;
    }, {});

    const data = stores.map((store) => ({
      ...store,
      rating: averageMap[store._id.toString()] ?? 0
    }));

    return res.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to list stores", error: error.message });
  }
};

module.exports = {
  dashboard,
  createUser,
  listUsers,
  getUserById,
  createStore,
  listStores
};
