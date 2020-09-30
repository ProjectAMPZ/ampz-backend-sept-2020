import Achievement from "../db/models/achievement.model";
import logger from "../config";
/**
 *Contains Achievement Controller
 *
 * @class AchievementController
 */
class AchievementController {
  /* eslint camelcase: 0 */

  /**
   * Create profile achievement.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async createAchievement(req, res) {
    req.body.userId = req.data.id;
    try {
      const achievement = await Achievement.create(req.body);
      res.status(201).json({
        status: "success",
        data: achievement,
      });
    } catch (err) {
      res.status(500).json({ status: "error", error: "Server error" });
    }
  }

  /**
   * update achievement.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof postController
   * @returns {JSON} - A JSON success response.
   */
  static async updateAchievement(req, res) {
    try {
      let achievement = await Achievement.findById({
        _id: req.params.achievementId,
      });

      if (!achievement) {
        return res
          .status(404)
          .json({ status: "error", message: "achievement not found" });
      }

      achievement = await Achievement.findOneAndUpdate(
        { _id: req.params.achievementId },
        req.body,
        {
          new: true,
        }
      );

      res.status(200).json({
        status: "success",
        data: achievement,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({
        status: "error",
        error: "Server error",
      });
    }
  }

  /**
   * get single achievement.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof postController
   * @returns {JSON} - A JSON success response.
   */
  static async getAchievement(req, res) {
    try {
      let achievement = await Achievement.findById({
        _id: req.params.achievementId,
      });

      if (!achievement) {
        return res
          .status(404)
          .json({ status: "error", message: "achievement not found" });
      }

      res.status(200).json({
        status: "success",
        data: achievement,
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        error: "Server error",
      });
    }
  }

  /**
   * Delete Achievement.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async deleteAchievement(req, res) {
    try {
      const achievement = await Achievement.findById({
        _id: req.params.achievementId,
      });

      if (!achievement) {
        return res
          .status(404)
          .json({ status: "404 Not Found", error: "achievement not found" });
      }

      await achievement.remove();

      res.status(200).json({
        status: "success",
        message: "achievement deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        error: "Server error",
      });
    }
  }
}

export default AchievementController;
