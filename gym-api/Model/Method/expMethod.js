const Exp = require('../Model/exp');

const expMethod = {
  create: async (data) => {
    try {
      const exp = new Exp(data);
      return await exp.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await Exp.findById(id).populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { totalexp: -1 } } = options;
      const skip = (page - 1) * limit;

      const exps = await Exp.find(filter)
        .populate('iduser')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Exp.countDocuments(filter);

      return {
        data: exps,
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
      return await Exp.findOne(filter).populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  readByUser: async (iduser) => {
    try {
      return await Exp.findOne({ iduser });
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      return await Exp.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate('iduser');
    } catch (error) {
      throw error;
    }
  },

  updateByUser: async (iduser, data) => {
    try {
      return await Exp.findOneAndUpdate({ iduser }, data, { new: true, runValidators: true });
    } catch (error) {
      throw error;
    }
  },

  incrementExp: async (iduser, amount) => {
    try {
      return await Exp.findOneAndUpdate(
        { iduser },
        { 
          $inc: { totalexp: amount, dailyexp: amount },
          $set: { lastupdated: Date.now() }
        },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  },

  resetDailyExp: async (iduser) => {
    try {
      return await Exp.findOneAndUpdate(
        { iduser },
        { 
          dailyexp: 0,
          lastexpreset: Date.now()
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await Exp.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = expMethod;
