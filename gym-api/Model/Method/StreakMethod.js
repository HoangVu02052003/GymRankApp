const Streak = require('../Model/Streak');

const streakMethod = {
  create: async (data) => {
    try {
      const streak = new Streak(data);
      return await streak.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await Streak.findById(id).populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { currentstreak: -1 } } = options;
      const skip = (page - 1) * limit;

      const streaks = await Streak.find(filter)
        .populate('iduser')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Streak.countDocuments(filter);

      return {
        data: streaks,
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
      return await Streak.findOne(filter).populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  readByUser: async (iduser) => {
    try {
      return await Streak.findOne({ iduser });
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      return await Streak.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  updateByUser: async (iduser, data) => {
    try {
      return await Streak.findOneAndUpdate({ iduser }, data, { new: true, runValidators: true });
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await Streak.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = streakMethod;
