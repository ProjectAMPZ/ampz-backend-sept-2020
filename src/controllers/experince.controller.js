import Experience from '../db/models/experience.model';
// import logger from "../config";
/**
 *Contains Experience Controller
 *
 * @class ExperienceController
 */
class ExperienceController {
  /* eslint camelcase: 0 */

  /**
   * Create profile experience.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async createExperience(req, res) {
    req.body.userId = req.data.id;
    try {
      await Experience.create(req.body);
      res.status(201).json({
        status: 'success',
        message: 'experience created successfully',
      });
    } catch (err) {
      // logger.error(err.message);
      res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }

  /**
   * update experience.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof postController
   * @returns {JSON} - A JSON success response.
   */
  static async updateExperience(req, res) {
    try {
      const experience = await Experience.findById({
        _id: req.params.experienceId,
      });

      if (!experience) {
        return res
          .status(404)
          .json({ status: 'error', message: 'experience not found' });
      }

      await Experience.findOneAndUpdate(
        { _id: req.params.experienceId },
        req.body,
        {
          new: true,
        }
      );

      res.status(200).json({
        status: 'success',
        message: 'experience updated successfully',
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }

  /**
   * Delete Experience.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async deleteExperience(req, res) {
    try {
      const experience = await Experience.findById({
        _id: req.params.experienceId,
      });

      if (!experience) {
        return res
          .status(404)
          .json({ status: '404 Not Found', error: 'experience not found' });
      }

      await experience.remove();

      res.status(200).json({
        status: 'success',
        message: 'experience deleted successfully',
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }
}

export default ExperienceController;
