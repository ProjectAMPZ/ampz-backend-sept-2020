import User from '../db/models/users.model';
import Helper from '../utils/user.utils';

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
    const { userName, phoneNumber } = req.body;
    try {
      const user = await User.findById(req.data.id);
      const users = await User.find({ userName: { $ne: user.userName } });
      const usernames = users.filter((user) => user.userName !== undefined);

      const names = usernames.map((user) => user.userName);
      const phoneNumbers = usernames.map((user) => user.phoneNumber);

      const usernameExist = names.includes(userName);
      const phonenumberExist = phoneNumbers.includes(phoneNumber);

      if (usernameExist && userName !== user.userName) {
        return res
          .status(400)
          .json({ status: 'error', message: 'username already exist' });
      }

      if (phonenumberExist && phoneNumber !== user.phoneNumber) {
        return res
          .status(400)
          .json({ status: 'error', message: 'phone number already exist' });
      }

      await User.findOneAndUpdate({ _id: req.data.id }, req.body, {
        new: true,
      });
      return res
        .status(200)
        .json({ status: 'success', message: 'bio updated' });
    } catch (err) {
      logger.error(err.message);
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

  /**
   * Update role.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof ProfileController
   * @returns {JSON} - A JSON success response.
   */
  static async updateBioRole(req, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: req.data.id }, req.body, {
        new: true,
      });

      const token = await Helper.generateToken(
        user.id,
        user.role,
        user.userName
      );

      res.status(200).json({ status: 'success', token });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }
}

export default BioController;
