import Watchlist from '../db/models/watchlist.model';
import WatchlistTalent from '../db/models/watchlistTalent.model';
import logger from '../config';

/**
 *Contains Watchlist Controller
 *
 * @class WatchlistController
 */
class WatchlistController {
  /* eslint camelcase: 0 */

  /**
   * Create Watchlist.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async addTalent(req, res) {
    try {
      let isExist = await Watchlist.findOne({ userId: req.data.id });
      if (!isExist) {
        let watchlist = {
          userId: req.data.id,
        };
        await Watchlist.create(watchlist);
        const talent = {
          userId: req.params.talentId,
          watchlistId: req.data.id,
        };
        await WatchlistTalent.create(talent);
        return res
          .status(201)
          .json({ status: 'success', message: 'talent added watchlist' });
      }

      const talent = {
        userId: req.params.talentId,
        watchlistId: req.data.id,
      };

      const managerWatchlist = await WatchlistTalent.find({
        watchlistId: req.data.id,
      });

      const talentExist = managerWatchlist.find(
        (talent) => talent.userId.toString() === req.params.talentId
      );

      if (talentExist) {
        return res.status(409).json({
          status: 'error',
          message: 'talent already added to watchlist',
        });
      }

      await WatchlistTalent.create(talent);

      res
        .status(201)
        .json({ status: 'success', message: 'talent added to watchlist' });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }

  /**
   * Remove Talent From Watchlist.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async removeTalent(req, res) {
    try {
      const talent = await WatchlistTalent.findOne({
        watchlistId: req.data.id,
        userId: req.params.talentId,
      });

      await WatchlistTalent.deleteOne(talent);
      res.status(200).json({
        status: 'success',
        message: 'talent removed',
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
   * get Talents.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async getTalents(req, res) {
    try {
      const talents = await WatchlistTalent.find({
        watchlistId: req.data.id,
      }).populate({
        path: 'userId',
        select: 'userName profilePhotoUrl',
      });

      res.status(200).json({
        status: 'success',
        count: talents.length,
        data: talents,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }
}

export default WatchlistController;
