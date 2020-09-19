import Auth from '../db/models/users.model';
import Activation from '../db/models/accountActivation.model';
import Feature from '../db/models/feature.model';
import Experience from '../db/models/experience.model';
import Association from '../db/models/association.model';
import Achievement from '../db/models/achievement.model';
import Helper from '../utils/user.utils';
import AuthServices from '../services/auth.services';
import sendEmail from '../utils/email.utils';
// import logger from '../config/logger';

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
          const featureRecord = {
            userId: createdUser._id
          };
          Feature.create({ ...featureRecord }, (err) => {
            if (err) {
              // logger.error(err);
              // throw new Error('Error occured in db during creation of users feature record');
            }
          });
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
      const condition = {
        userId: user._Id
      };
      const feature = await Feature.find(condition, (err) => {
        if (err) {
          // logger.error(err);
          // throw new Error('Error occured in db fetching feature');
        }
      });
      const experience = await Experience.find(condition, (err) => {
        if (err) {
          // logger.error(err);
          // throw new Error('Error occured in db fetching experience');
        }
      });
      const association = await Association.find(condition, (err) => {
        if (err) {
          // logger.error(err);
          // throw new Error('Error occured in db fetching association');
        }
      });
      const achievement = await Achievement.find(condition, (err) => {
        if (err) {
          // logger.error(err);
          // throw new Error('Error occured in db fetching achievement');
        }
      });
      const token = await Helper.generateToken(user._id, user.role, user.userName);
      return res.status(200).json({
        status: 'success',
        data: {
          token,
          user,
          feature,
          experience,
          association,
          achievement
        }
      });
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error activating user account'
      });
    }
  }

  /**
   * Login user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await AuthServices.emailExist(email, res);

      if (!user.length) {
        return res.status(401).json({
          status: '401 Unauthorized',
          error: 'Invalid Email address'
        });
      }

      const confirmPassword = await Helper.verifyPassword(password, user[0].password);
      if (!confirmPassword) {
        return res.status(401).json({
          status: '401 Unauthorized',
          error: 'Invalid Password'
        });
      }

      const condition = {
        userId: user._Id
      };
      const feature = await Feature.find(condition, (err) => {
        if (err) {
          // logger.error(err);
          // throw new Error('Error occured in db fetching feature');
        }
      });
      const experience = await Experience.find(condition, (err) => {
        if (err) {
          // logger.error(err);
          // throw new Error('Error occured in db fetching experience');
        }
      });
      const association = await Association.find(condition, (err) => {
        if (err) {
          // logger.error(err);
          // throw new Error('Error occured in db fetching association');
        }
      });
      const achievement = await Achievement.find(condition, (err) => {
        if (err) {
          // logger.error(err);
          // throw new Error('Error occured in db fetching achievement');
        }
      });

      const token = await Helper.generateToken(user[0]._id, user[0].role, user[0].userName);
      return res.status(200).json({
        status: 'success',
        data: {
          token,
          user: {
            _id: user[0]._id,
            fullName: user[0].fullName,
            userName: user[0].userName,
            email: user[0].email,
            verified: user[0].verified,
            isActivated: user[0].isActivated,
            gender: user[0].gender,
            country: user[0].country,
            phoneNumber: user[0].phoneNumber,
            dayOfBirth: user[0].dayOfBirth,
            monthOfBirth: user[0].monthOfBirth,
            yearOfBirth: user[0].yearOfBirth,
            role: user[0].role,
          },
          feature,
          experience,
          association,
          achievement
        }
      });
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error Logging in user'
      });
    }
  }
}
export default AuthController;
