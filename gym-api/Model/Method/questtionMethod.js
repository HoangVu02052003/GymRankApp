const Questtion = require('../Model/questtion');

const questtionMethod = {
  create: async (data) => {
    try {
      const questtion = new Questtion(data);
      return await questtion.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await Questtion.findById(id).populate('idrank');
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
      const skip = (page - 1) * limit;

      const questtions = await Questtion.find(filter)
        .populate('idrank')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Questtion.countDocuments(filter);

      return {
        data: questtions,
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
      return await Questtion.findOne(filter).populate('idrank');
    } catch (error) {
      throw error;
    }
  },

  readByRank: async (idrank, options = {}) => {
    try {
      const { limit = 10 } = options;

      const questtions = await Questtion.find({ idrank }).limit(limit);
      return questtions;
    } catch (error) {
      throw error;
    }
  },

  readByDifficulty: async (difficulty, options = {}) => {
    try {
      const { limit = 10 } = options;

      const questtions = await Questtion.find({ difficulty }).limit(limit);
      return questtions;
    } catch (error) {
      throw error;
    }
  },

  readRandom: async (filter = {}, limit = 10) => {
    try {
      const questtions = await Questtion.aggregate([
        { $match: filter },
        { $sample: { size: limit } }
      ]);
      return questtions;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      return await Questtion.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate('idrank');
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await Questtion.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = questtionMethod;
