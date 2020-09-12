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
  static login(req, res) {
    try {
      const { username, password } = req.body;

      return res.status(200).json({
        status: 'success',
        data: 'This is Login Route',
        username,
        password
      });
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error getting exercise'
      });
    }
  }
}
export default AuthController;
