const User = require('../Model/user');

const userMethod = {
  create: async (data) => {
    try {
      const user = new User(data);
      return await user.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await User.findById(id).populate('idthongtin');
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
      const skip = (page - 1) * limit;

      const users = await User.find(filter)
        .populate('idthongtin')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments(filter);

      return {
        data: users,
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
      return await User.findOne(filter).populate('idthongtin');
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  },

  exists: async (filter) => {
    try {
      return await User.exists(filter);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = userMethod;
