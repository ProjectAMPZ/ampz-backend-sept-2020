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
   * create/update a user Feature.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof FeatureController
   * @returns {JSON} - A JSON success response.
   */
  static async createFeature(req, res) {
    try {
      req.body.userId = req.data.id;

      await (await Feature.create(req.body)).populate('userId');
      return res
        .status(201)
        .json({ status: 'success', message: 'feature created successfully' });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'server error' });
    }
  }
}

export default FeatureController;
