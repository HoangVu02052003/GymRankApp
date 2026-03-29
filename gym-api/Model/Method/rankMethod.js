const Rank = require('../Model/rank');

const rankMethod = {
  create: async (data) => {
    try {
      const rank = new Rank(data);
      return await rank.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await Rank.findById(id);
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { level: 1 } } = options;
      const skip = (page - 1) * limit;

      const ranks = await Rank.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Rank.countDocuments(filter);

      return {
        data: ranks,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  },

  readOne: async (filter) => {
    try {
      return await Rank.findOne(filter);
    } catch (error) {
      throw error;
    }
  },

  readByLevel: async (level) => {
    try {
      return await Rank.findOne({ level });
    } catch (error) {
      throw error;
    }
  },

  readByExpRange: async (exp) => {
    try {
      return await Rank.findOne({ exprequired: { $lte: exp } })
        .sort({ exprequired: -1 });
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      return await Rank.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await Rank.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = rankMethod;
