import Auth from '../db/models/users.model';
import logger from '../config';

/**
 *Contains Auth Controller
 *
 * @class AuthController
 */
class AuthController {
  /* eslint camelcase: 0 */
  /**
   * Logins a user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async login(req, res) {
    try {
      return res.status(200).json({
        status: 'success',
        data: 'This is Login Route'
      });
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error getting exercise'
      });
    }
  }

  /**
   * Logins a user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async signUp(req, res) {
    try {
      const { email, password } = req.body;
      const newUser = {
        email,
        password
      };
      await Auth.create({ ...newUser }, (err, createdUser) => {
        if (err) logger.info(err);

        return res.status(201).json({
          status: 'success',
          data: createdUser
        });
      });
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error Creating new User'
      });
    }
  }
}
export default AuthController;
