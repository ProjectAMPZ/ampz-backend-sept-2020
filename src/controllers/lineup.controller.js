import Lineup from '../db/models/lineup.model';
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
}

export default LineupController;
