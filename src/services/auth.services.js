import Auth from '../db/models/users.model';
import Activation from '../db/models/accountActivation.model';

export default {

  async emailExist(email, res) {
    try {
      const condition = {
        email
      };
      const user = await Auth.find(condition);
      return user;
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error checking for email'
      });
    }
  },

  async usernameExist(username, res) {
    try {
      const condition = {
        userName: username
      };
      const user = await Auth.find(condition);
      return user;
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error checking for username'
      });
    }
  },

  async googleIdExist(id, res) {
    try {
      const condition = {
        googleUserId: id
      };
      const user = await Auth.find(condition);
      return user;
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error checking for google Id'
      });
    }
  },

  async phoneExist(phonenumber, res) {
    try {
      const condition = {
        phoneNumber: phonenumber
      };
      const user = await Auth.find(condition);
      return user;
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error checking phonenumber'
      });
    }
  },

  async matchCode(id, code, res) {
    try {
      const condition = {
        userId: id
      };
      const user = await Activation.find(condition);
      if (user[0].passcode === code) {
        return true;
      }
      return false;
    } catch (err) {
      return res.status(500).json({
        status: '500 Internal server error',
        error: 'Error matching activation code'
      });
    }
  },
};
