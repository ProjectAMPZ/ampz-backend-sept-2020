import Auth from '../db/models/users.model';
import Activation from '../db/models/accountActivation.model';
import Helper from '../utils/user.utils';
import sendEmail from '../utils/email.utils';

/**
 *Contains Auth Controller
 *
 *
 *
 * @class AuthController
 */
class AuthController {
  /**
   * Create account for a user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async signUp(req, res) {
    try {
      const {
        fullName,
        userName,
        password,
        email,
        gender,
        country,
        phoneNumber,
        dayOfBirth,
        monthOfBirth,
        yearOfBirth,
        role
      } = req.body;

      const encryptpassword = await Helper.encrptPassword(password);

      const newUser = {
        fullName,
        userName,
        password: encryptpassword,
        email,
        gender,
        country,
        phoneNumber,
        dayOfBirth,
        monthOfBirth,
        yearOfBirth,
        role
      };
      const code = await Helper.generateCode(5);
      await Auth.create({ ...newUser }, (err, createdUser) => {
        if (err) {
          // logger.error(err);
          // throw new Error('Error occured in db during creation of user');
        } else {
          const activationRecord = {
            userId: createdUser._id,
            email: createdUser.email,
            passcode: code
          };
          const message = `Your account activation code is <b>${code}<b/>`;
          sendEmail(createdUser.email, 'Account Activation', message);
          Activation.create({ ...activationRecord }, (err) => {
            if (err) {
              // logger.error(err);
              // throw new Error('Error occured in db during creation of activation record');
            }

            return res.status(201).json({
              status: 'success',
              message: 'Account activation code has been sent to your email'
            });
          });
        }
      });
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error creating new user'
      });
    }
  }

  /**
   * Activate user account.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async activateAccount(req, res) {
    try {
      const {
        _id
      } = req.body;
      const newData = {
        isActivated: true
      };
      const user = await Auth.findByIdAndUpdate(_id, { ...newData }, (err) => {
        if (err) {
          // logger.error(err);
          // throw new Error('Error occured in db during user activation');
        }
      });
      const token = await Helper.generateToken(user._id, user.role, user.userName);
      return res.status(200).json({
        status: 'success',
        data: {
          token,
          user
        }
      });
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error activating user account'
      });
    }
  }
}
export default AuthController;
