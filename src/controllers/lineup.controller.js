import Lineup from '../db/models/lineup.model';
import TalentLineup from '../db/models/talentLineup.model';
import logger from '../config';

/**
 *Contains Lineup Controller
 *
 * @class LineupController
 */
class LineupController {
  /* eslint camelcase: 0 */

  /**
   * Create profile Lineup.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async createLineup(req, res) {
    req.body.userId = req.data.id;
    try {
      const lineup = await Lineup.create(req.body);
      res.status(201).json({
        status: 'success',
        data: lineup,
      });
    } catch (err) {
      // logger.error(err.message);
      // res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }

  /**
   * Update Lineup.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async updateLineup(req, res) {
    try {
      const lineup = await Lineup.findOneAndUpdate(
        { _id: req.params.lineupId },
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json({
        status: 'success',
        data: lineup,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }

  /**
   * Delete Lineup.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async deleteLineup(req, res) {
    try {
      await Lineup.findOneAndRemove({ _id: req.params.lineupId });
      res.status(200).json({
        status: 'success',
        message: 'lineup deleted successfully',
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }

  /**
   * get Lineup.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async getLineup(req, res) {
    try {
      const lineup = await Lineup.findById(req.params.lineupId);
      res.status(200).json({
        status: 'success',
        data: lineup,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }

  /**
   * get Lineups.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async getLineups(req, res) {
    try {
      const lineups = await Lineup.find({
        userId: req.data.id,
      });

      res.status(200).json({
        status: 'success',
        count: lineups.length,
        data: lineups,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }

  /**
   * add Talent to Lineup.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async addTalentToLineup(req, res) {
    const lineupId = req.data.id;
    const userId = req.params.talentId;
    try {
      let talent = {
        userId,
        lineupId,
      };

      const isExist = await TalentLineup.findOne({
        userId: req.params.talentId,
      });
      if (isExist) {
        return res.status(400).json({
          status: 'error',
          message: 'you already sent a request to this talent',
        });
      }

      const newTalent = await TalentLineup.create(talent);
      res.status(200).json({
        status: 'success',
        data: newTalent,
      });
    } catch (err) {
      // logger.error(err.message);
      // res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }

  /**
   * upadte talents.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async updateTalent(req, res) {
    try {
      const talent = await TalentLineup.findOneAndUpdate(
        { _id: req.params.talentId },
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json({
        status: 'success',
        data: talent,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }

  /**
   * get all talents.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async getLineUpTalents(req, res) {
    try {
      const talents = await TalentLineup.find({
        lineupId: req.data.id,
      }).populate({
        path: 'userId',
        select: 'fullName yearOfBirth',
        populate: {
          path: 'feature',
          select: 'sport position',
        },
      });
      res.status(200).json({
        status: 'success',
        count: talents.length,
        data: talents,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }

  /**
   * remove Talent.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async removeTalentFromLineup(req, res) {
    try {
      await TalentLineup.findByIdAndRemove(req.params.talentId);
      res.status(200).json({
        status: 'success',
        message: 'talent removed',
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }
}

export default LineupController;
