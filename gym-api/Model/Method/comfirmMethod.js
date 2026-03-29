const Comfirm = require('../Model/comfirm');

const comfirmMethod = {
  create: async (data) => {
    try {
      const comfirm = new Comfirm(data);
      return await comfirm.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await Comfirm.findById(id).populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { date: -1 } } = options;
      const skip = (page - 1) * limit;

      const comfirms = await Comfirm.find(filter)
        .populate('iduser')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Comfirm.countDocuments(filter);

      return {
        data: comfirms,
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
      return await Comfirm.findOne(filter).populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  readByUser: async (iduser, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const comfirms = await Comfirm.find({ iduser })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Comfirm.countDocuments({ iduser });

      return {
        data: comfirms,
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

  readByStatus: async (status, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const comfirms = await Comfirm.find({ status })
        .populate('iduser')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Comfirm.countDocuments({ status });

      return {
        data: comfirms,
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
      return await Comfirm.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await Comfirm.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = comfirmMethod;
