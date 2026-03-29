const HistoryExp = require('../Model/historyExp');

const historyExpMethod = {
  create: async (data) => {
    try {
      const historyExp = new HistoryExp(data);
      return await historyExp.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await HistoryExp.findById(id).populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { date: -1 } } = options;
      const skip = (page - 1) * limit;

      const histories = await HistoryExp.find(filter)
        .populate('iduser')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await HistoryExp.countDocuments(filter);

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
      return await HistoryExp.findOne(filter).populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  readByUser: async (iduser, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const histories = await HistoryExp.find({ iduser })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      const total = await HistoryExp.countDocuments({ iduser });

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

  readByReason: async (reason, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const histories = await HistoryExp.find({ reason })
        .populate('iduser')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      const total = await HistoryExp.countDocuments({ reason });

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
      return await HistoryExp.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await HistoryExp.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = historyExpMethod;
