const HistoryUser = require('../Model/historyuser');

const historyuserMethod = {
  create: async (data) => {
    try {
      const history = new HistoryUser(data);
      return await history.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await HistoryUser.findById(id).populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { datechange: -1 } } = options;
      const skip = (page - 1) * limit;

      const histories = await HistoryUser.find(filter)
        .populate('iduser')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await HistoryUser.countDocuments(filter);

      return {
        data: histories,
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
      return await HistoryUser.findOne(filter).populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  readByUser: async (iduser, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const histories = await HistoryUser.find({ iduser })
        .sort({ datechange: -1 })
        .skip(skip)
        .limit(limit);

      const total = await HistoryUser.countDocuments({ iduser });

      return {
        data: histories,
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

  update: async (id, data) => {
    try {
      return await HistoryUser.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await HistoryUser.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = historyuserMethod;
