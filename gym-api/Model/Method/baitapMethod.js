const Baitap = require('../Model/baitap');

const baitapMethod = {
  create: async (data) => {
    try {
      const baitap = new Baitap(data);
      return await baitap.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await Baitap.findById(id);
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { tenbaitap: 1 } } = options;
      const skip = (page - 1) * limit;

      const baitaps = await Baitap.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Baitap.countDocuments(filter);

      return {
        data: baitaps,
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
      return await Baitap.findOne(filter);
    } catch (error) {
      throw error;
    }
  },

  readByNhomCo: async (nhomco, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const baitaps = await Baitap.find({ nhomco })
        .sort({ tenbaitap: 1 })
        .skip(skip)
        .limit(limit);

      const total = await Baitap.countDocuments({ nhomco });

      return {
        data: baitaps,
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

  readByDifficulty: async (dokho, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const baitaps = await Baitap.find({ dokho })
        .sort({ tenbaitap: 1 })
        .skip(skip)
        .limit(limit);

      const total = await Baitap.countDocuments({ dokho });

      return {
        data: baitaps,
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

  search: async (keyword, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const filter = {
        $or: [
          { tenbaitap: { $regex: keyword, $options: 'i' } },
          { nhomco: { $regex: keyword, $options: 'i' } },
          { mota: { $regex: keyword, $options: 'i' } }
        ]
      };

      const baitaps = await Baitap.find(filter)
        .sort({ tenbaitap: 1 })
        .skip(skip)
        .limit(limit);

      const total = await Baitap.countDocuments(filter);

      return {
        data: baitaps,
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
      return await Baitap.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await Baitap.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = baitapMethod;
