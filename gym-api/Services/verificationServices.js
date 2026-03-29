const comfirmMethod = require('../Model/Method/comfirmMethod');
const thongtinMethod = require('../Model/Method/thongtinMethod');
const userMethod = require('../Model/Method/userMethod');

const verificationServices = {
  uploadVideoVerification: async (iduser, videourl) => {
    try {
      const user = await userMethod.read(iduser);
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }

      const pendingVerification = await comfirmMethod.readOne({
        iduser,
        status: 'pending'
      });

      if (pendingVerification) {
        return {
          success: false,
          message: 'Bạn đã có yêu cầu xác thực đang chờ duyệt'
        };
      }

      const comfirm = await comfirmMethod.create({
        iduser,
        videourl,
        status: 'pending'
      });

      return {
        success: true,
        message: 'Upload video thành công, đang chờ admin duyệt',
        comfirm
      };
    } catch (error) {
      throw error;
    }
  },

  approveVerification: async (idcomfirm, adminNote = '') => {
    try {
      const comfirm = await comfirmMethod.read(idcomfirm);
      if (!comfirm) {
        throw new Error('Không tìm thấy yêu cầu xác thực');
      }

      const updatedComfirm = await comfirmMethod.update(idcomfirm, {
        status: 'approved',
        adminNote
      });

      const user = await userMethod.read(comfirm.iduser);
      await thongtinMethod.update(user.idthongtin._id, {
        xacthuc: true,
        idcomfirm: idcomfirm
      });

      return {
        success: true,
        message: 'Xác thực thành công',
        comfirm: updatedComfirm
      };
    } catch (error) {
      throw error;
    }
  },

  rejectVerification: async (idcomfirm, adminNote = '') => {
    try {
      const comfirm = await comfirmMethod.read(idcomfirm);
      if (!comfirm) {
        throw new Error('Không tìm thấy yêu cầu xác thực');
      }

      const updatedComfirm = await comfirmMethod.update(idcomfirm, {
        status: 'rejected',
        adminNote
      });

      return {
        success: true,
        message: 'Từ chối xác thực',
        comfirm: updatedComfirm
      };
    } catch (error) {
      throw error;
    }
  },

  getPendingVerifications: async (options = {}) => {
    try {
      return await comfirmMethod.readByStatus('pending', options);
    } catch (error) {
      throw error;
    }
  },

  getUserVerifications: async (iduser, options = {}) => {
    try {
      return await comfirmMethod.readByUser(iduser, options);
    } catch (error) {
      throw error;
    }
  },

  checkVerificationStatus: async (iduser) => {
    try {
      const user = await userMethod.read(iduser);
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }

      const thongtin = user.idthongtin;
      const latestVerification = await comfirmMethod.readOne({
        iduser,
        $or: [{ status: 'pending' }, { status: 'approved' }]
      });

      return {
        isVerified: thongtin?.xacthuc || false,
        latestVerification,
        canUpload: !latestVerification || latestVerification.status !== 'pending'
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = verificationServices;
