const Test = require('../Model/test');

const testMethod = {
  create: async (data) => {
    try {
      const test = new Test(data);
      return await test.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await Test.findById(id)
        .populate('iduser')
        .populate('idrank')
        .populate('answers.idquestion');
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { date: -1 } } = options;
      const skip = (page - 1) * limit;

      const tests = await Test.find(filter)
        .populate('iduser')
        .populate('idrank')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Test.countDocuments(filter);

      return {
        data: tests,
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
      return await Test.findOne(filter)
        .populate('iduser')
        .populate('idrank')
        .populate('answers.idquestion');
    } catch (error) {
      throw error;
    }
  },

  readByUser: async (iduser, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const tests = await Test.find({ iduser })
        .populate('idrank')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Test.countDocuments({ iduser });

      return {
        data: tests,
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

  readByRank: async (idrank, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const tests = await Test.find({ idrank })
        .populate('iduser')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Test.countDocuments({ idrank });

      return {
        data: tests,
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
      return await Test.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate('iduser')
        .populate('idrank');
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await Test.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = testMethod;
