const ChiTietLichTrinh = require('../Model/ChiTietLichTrinh');

const chiTietLichTrinhMethod = {
  create: async (data) => {
    try {
      const chiTiet = new ChiTietLichTrinh(data);
      return await chiTiet.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await ChiTietLichTrinh.findById(id).populate('idbaitap');
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { date: -1 } } = options;
      const skip = (page - 1) * limit;

      const chiTiets = await ChiTietLichTrinh.find(filter)
        .populate('idbaitap')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await ChiTietLichTrinh.countDocuments(filter);

      return {
        data: chiTiets,
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
      return await ChiTietLichTrinh.findOne(filter).populate('idbaitap');
    } catch (error) {
      throw error;
    }
  },

  readByDate: async (date, options = {}) => {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const chiTiets = await ChiTietLichTrinh.find({
        date: { $gte: startOfDay, $lte: endOfDay }
      }).populate('idbaitap');

      return chiTiets;
    } catch (error) {
      throw error;
    }
  },

  readByStatus: async (trangthai, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const chiTiets = await ChiTietLichTrinh.find({ trangthai })
        .populate('idbaitap')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      const total = await ChiTietLichTrinh.countDocuments({ trangthai });

      return {
        data: chiTiets,
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
      return await ChiTietLichTrinh.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate('idbaitap');
    } catch (error) {
      throw error;
    }
  },

  markCompleted: async (id) => {
    try {
      return await ChiTietLichTrinh.findByIdAndUpdate(
        id,
        { 
          trangthai: true,
          completedAt: Date.now()
        },
        { new: true, runValidators: true }
      ).populate('idbaitap');
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await ChiTietLichTrinh.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = chiTietLichTrinhMethod;
