const Thongtin = require('../Model/thongtin');

const thongtinMethod = {
  create: async (data) => {
    try {
      const thongtin = new Thongtin(data);
      return await thongtin.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await Thongtin.findById(id)
        .populate('idrank')
        .populate('idcomfirm')
        .populate('idtest');
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
      const skip = (page - 1) * limit;

      const thongtins = await Thongtin.find(filter)
        .populate('idrank')
        .populate('idcomfirm')
        .populate('idtest')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Thongtin.countDocuments(filter);

      return {
        data: thongtins,
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
      return await Thongtin.findOne(filter)
        .populate('idrank')
        .populate('idcomfirm')
        .populate('idtest');
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      return await Thongtin.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate('idrank')
        .populate('idcomfirm')
        .populate('idtest');
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await Thongtin.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = thongtinMethod;
