import Feature from "../db/models/feature.model";
import logger from "../config";
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

      await (await Feature.create(req.body)).populate("userId");
      return res
        .status(201)
        .json({ status: "success", message: "feature created successfully" });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ status: "error", error: "server error" });
    }
  }

  /**
   * update feature.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof postController
   * @returns {JSON} - A JSON success response.
   */
  static async updateFeature(req, res) {
    try {
      const feature = await Feature.findOne({
        userId: req.params.userId,
      });

      if (!feature) {
        return res
          .status(404)
          .json({ status: "404 Not Found", message: "feature not found" });
      }

      await Feature.findOneAndUpdate(req.params.userId, req.body, {
        new: true,
      });

      res
        .status(200)
        .json({ status: "success", message: "feature updated successfully" });
    } catch (err) {
      // logger.error(err.message);
      res.status(500).json({
        status: "500 Internal server error",
        error: "Error updating feature",
      });
    }
  }
}

export default FeatureController;
