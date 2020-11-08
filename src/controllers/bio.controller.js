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

  /**
   * Update bio.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProfileController
   * @returns {JSON} - A JSON success response.
   */
  static async uploadImage(req, res) {
    try {
      await User.findOneAndUpdate({ _id: req.data.id }, req.body);
      res.status(200).json({
        status: 'success',
        message: 'profile picture updated successfully',
      });
    } catch (err) {
      // logger.error(err.message);
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }

  // /**
  //  * Upload Proof.
  //  * @param {Request} req - Response object.
  //  * @param {Response} res - The payload.
  //  * @memberof ProfileController
  //  * @returns {JSON} - A JSON success response.
  //  */
  // static async uploadProofs(req, res) {
  //   try {
  //     await User.findOneAndUpdate({ _id: req.data.id }, req.body);
  //     res.status(200).json({
  //       status: 'success',
  //       message: 'proof uploaded',
  //     });
  //   } catch (err) {
  //     logger.error(err.message);
  //     res.status(500).json({
  //       status: 'error',
  //       error: 'Server error',
  //     });
  //   }
  // }

  // /**
  //  * Upload Proof.
  //  * @param {Request} req - Response object.
  //  * @param {Response} res - The payload.
  //  * @memberof ProfileController
  //  * @returns {JSON} - A JSON success response.
  //  */
  // static async uploadProofs(req, res) {
  //   try {
  //     const user = await User.findOne({ _id: req.data.id });
  //     user.proofs.push(req.body);

  //     await user.save();
  //     res.status(200).json({
  //       status: 'success',
  //       message: 'proof uploaded',
  //       data: user.proofs,
  //     });
  //   } catch (err) {
  //     logger.error(err.message);
  //     res.status(500).json({
  //       status: 'error',
  //       error: 'Server error',
  //     });
  //   }
  // }

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
