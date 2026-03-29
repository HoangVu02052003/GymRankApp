const LichTrinh = require('../Model/LichTrinh');

const lichTrinhMethod = {
  create: async (data) => {
    try {
      const lichTrinh = new LichTrinh(data);
      return await lichTrinh.save();
    } catch (error) {
      throw error;
    }
  },

  read: async (id) => {
    try {
      return await LichTrinh.findById(id)
        .populate('iduser')
        .populate({
          path: 'idChiTiet',
          populate: { path: 'idbaitap' }
        });
    } catch (error) {
      throw error;
    }
  },

  readAll: async (filter = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
      const skip = (page - 1) * limit;

      const lichTrinhs = await LichTrinh.find(filter)
        .populate('iduser')
        .populate({
          path: 'idChiTiet',
          populate: { path: 'idbaitap' }
        })
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await LichTrinh.countDocuments(filter);

      return {
        data: lichTrinhs,
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
      return await LichTrinh.findOne(filter)
        .populate('iduser')
        .populate({
          path: 'idChiTiet',
          populate: { path: 'idbaitap' }
        });
    } catch (error) {
      throw error;
    }
  },

  readByUser: async (iduser, options = {}) => {
    try {
      const { page = 1, limit = 10, activeOnly = false } = options;
      const skip = (page - 1) * limit;

      const filter = { iduser };
      if (activeOnly) {
        filter.active = true;
      }

      const lichTrinhs = await LichTrinh.find(filter)
        .populate({
          path: 'idChiTiet',
          populate: { path: 'idbaitap' }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await LichTrinh.countDocuments(filter);

      return {
        data: lichTrinhs,
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
      return await LichTrinh.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate('iduser')
        .populate({
          path: 'idChiTiet',
          populate: { path: 'idbaitap' }
        });
    } catch (error) {
      throw error;
    }
  },

  addChiTiet: async (id, idChiTiet) => {
    try {
      return await LichTrinh.findByIdAndUpdate(
        id,
        { $push: { idChiTiet } },
        { new: true, runValidators: true }
      ).populate({
        path: 'idChiTiet',
        populate: { path: 'idbaitap' }
      });
    } catch (error) {
      throw error;
    }
  },

  removeChiTiet: async (id, idChiTiet) => {
    try {
      return await LichTrinh.findByIdAndUpdate(
        id,
        { $pull: { idChiTiet } },
        { new: true, runValidators: true }
      ).populate({
        path: 'idChiTiet',
        populate: { path: 'idbaitap' }
      });
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await LichTrinh.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = lichTrinhMethod;
