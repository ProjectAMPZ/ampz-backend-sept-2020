import Feature from '../db/models/feature.model';
import logger from '../config';
/**
 *Contains Feature Controller
 *
 * @class FeatureController
 */
class FeatureController {
  /* eslint camelcase: 0 */

  /**
   * update feature.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof postController
   * @returns {JSON} - A JSON success response.
   */
  static async updateFeature(req, res) {
    try {
      await Feature.findOneAndUpdate({ userId: req.data.id }, req.body, {
        new: true,
      });

      res
        .status(200)
        .json({ status: 'success', message: 'feature updated successfully' });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({
        status: '500 Internal server error',
        error: 'Error updating feature',
      });
    }
  }

  /**
   * get user Feature.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof postController
   * @returns {JSON} - A JSON success response.
   */
  static async getUserFeature(req, res) {
    try {
      const feature = await Feature.find({ userId: req.data.id });

      res.status(200).json({
        status: 'success',
        data: feature,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }
}

export default FeatureController;
