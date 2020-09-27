import User from '../db/models/users.model';

/**
 *Contains Bio Controller
 *
 * @class BioController
 */
class BioController {
  /* eslint camelcase: 0 */
  /**
  /**
   * Update bio.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProfileController
   * @returns {JSON} - A JSON success response.
   */
  static async updateBio(req, res) {
    try {
      await User.findOneAndUpdate({ _id: req.data.id }, req.body);

      res
        .status(200)
        .json({ status: 'success', message: 'bio updated successfully' });
    } catch (err) {
      // logger.error(err.message);
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }

  /**
   * Update role.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProfileController
   * @returns {JSON} - A JSON success response.
   */
  static async updateBioRole(req, res) {
    try {
      await User.findOneAndUpdate({ _id: req.data.id }, req.body, {
        new: true,
      });

      res
        .status(200)
        .json({ status: 'success', message: 'bio updated successfully' });
    } catch (err) {
      // logger.error(err.message);
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }
}

export default BioController;
