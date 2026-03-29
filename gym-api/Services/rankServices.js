const rankMethod = require('../Model/Method/rankMethod');
const expMethod = require('../Model/Method/expMethod');
const thongtinMethod = require('../Model/Method/thongtinMethod');
const testMethod = require('../Model/Method/testMethod');
const questtionMethod = require('../Model/Method/questtionMethod');
const comfirmMethod = require('../Model/Method/comfirmMethod');
const historyExpMethod = require('../Model/Method/historyExpMethod');

const rankServices = {
  getAllRanks: async (options = {}) => {
    try {
      return await rankMethod.readAll({}, { sort: { level: 1 }, ...options });
    } catch (error) {
      throw error;
    }
  },

  getCurrentRank: async (iduser) => {
    try {
      const exp = await expMethod.readByUser(iduser);
      if (!exp) {
        throw new Error('Không tìm thấy thông tin EXP');
      }

      const rank = await rankMethod.readByExpRange(exp.totalexp);
      return rank || await rankMethod.readByLevel(1);
    } catch (error) {
      throw error;
    }
  },

  checkRankUp: async (iduser) => {
    try {
      const exp = await expMethod.readByUser(iduser);
      const currentRank = await rankServices.getCurrentRank(iduser);
      
      const allRanks = await rankMethod.readAll({}, { sort: { level: 1 }, limit: 100 });
      const nextRank = allRanks.data.find(r => r.level === currentRank.level + 1);

      if (!nextRank) {
        return {
          canRankUp: false,
          message: 'Đã đạt rank cao nhất',
          currentRank,
          nextRank: null
        };
      }

      if (exp.totalexp < nextRank.exprequired) {
        return {
          canRankUp: false,
          message: `Cần thêm ${nextRank.exprequired - exp.totalexp} EXP để lên rank`,
          currentRank,
          nextRank,
          expNeeded: nextRank.exprequired - exp.totalexp
        };
      }

      const thongtin = await thongtinMethod.readOne({ _id: exp.iduser });
      
      if (nextRank.requiretest) {
        const passedTest = await testMethod.readOne({
          iduser,
          idrank: nextRank._id,
          passed: true
        });

        if (!passedTest) {
          return {
            canRankUp: false,
            message: 'Cần vượt qua bài kiểm tra để lên rank này',
            currentRank,
            nextRank,
            requireTest: true
          };
        }
      }

      if (nextRank.requirevideo && !thongtin?.xacthuc) {
        const approvedVideo = await comfirmMethod.readOne({
          iduser,
          status: 'approved'
        });

        if (!approvedVideo) {
          return {
            canRankUp: false,
            message: 'Cần xác thực video để lên rank này',
            currentRank,
            nextRank,
            requireVideo: true
          };
        }
      }

      return {
        canRankUp: true,
        message: 'Đủ điều kiện lên rank',
        currentRank,
        nextRank
      };
    } catch (error) {
      throw error;
    }
  },

  rankUp: async (iduser) => {
    try {
      const checkResult = await rankServices.checkRankUp(iduser);
      
      if (!checkResult.canRankUp) {
        return {
          success: false,
          ...checkResult
        };
      }

      const thongtin = await thongtinMethod.readOne({ _id: iduser });
      await thongtinMethod.update(thongtin._id, {
        idrank: checkResult.nextRank._id
      });

      await historyExpMethod.create({
        iduser,
        expchange: 0,
        reason: 'rank_up',
        details: `Lên rank ${checkResult.nextRank.tenrank}`
      });

      return {
        success: true,
        message: `Chúc mừng! Lên rank ${checkResult.nextRank.tenrank}`,
        newRank: checkResult.nextRank
      };
    } catch (error) {
      throw error;
    }
  },

  createTest: async (iduser, idrank, numQuestions = 10) => {
    try {
      const rank = await rankMethod.read(idrank);
      if (!rank) {
        throw new Error('Rank không tồn tại');
      }

      const questions = await questtionMethod.readRandom({ idrank }, numQuestions);
      
      if (questions.length === 0) {
        throw new Error('Không có câu hỏi cho rank này');
      }

      return {
        success: true,
        idrank,
        rank: rank.tenrank,
        questions: questions.map(q => ({
          id: q._id,
          questtion: q.questtion,
          options: q.options.map(opt => ({ option: opt.option }))
        }))
      };
    } catch (error) {
      throw error;
    }
  },

  submitTest: async (iduser, idrank, answers) => {
    try {
      const questions = await questtionMethod.readByRank(idrank, { limit: 100 });
      
      let correctCount = 0;
      const processedAnswers = [];

      for (const answer of answers) {
        const question = questions.find(q => q._id.toString() === answer.idquestion);
        if (question) {
          const isCorrect = question.correctanswer === answer.useranswer;
          if (isCorrect) correctCount++;
          
          processedAnswers.push({
            idquestion: answer.idquestion,
            useranswer: answer.useranswer,
            correct: isCorrect
          });
        }
      }

      const totalQuestions = answers.length;
      const score = Math.round((correctCount / totalQuestions) * 100);
      const passed = score >= 70;

      const test = await testMethod.create({
        iduser,
        idrank,
        score,
        totalquestions: totalQuestions,
        correctanswers: correctCount,
        passed,
        answers: processedAnswers
      });

      return {
        success: true,
        passed,
        score,
        correctanswers: correctCount,
        totalquestions: totalQuestions,
        test
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = rankServices;
