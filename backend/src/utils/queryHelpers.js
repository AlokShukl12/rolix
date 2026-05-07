const buildRegexFilters = (query, fields) => {
  const filters = {};
  fields.forEach((field) => {
    if (query[field]) {
      filters[field] = { $regex: query[field], $options: "i" };
    }
  });
  return filters;
};

const parseSort = (query, allowedSortFields, defaultSort = "createdAt") => {
  const sortBy = query.sortBy && allowedSortFields.includes(query.sortBy) ? query.sortBy : defaultSort;
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;
  return { [sortBy]: sortOrder };
};

const parsePagination = (query) => {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Math.min(Number(query.limit), 100) : 20;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = {
  buildRegexFilters,
  parseSort,
  parsePagination
};
