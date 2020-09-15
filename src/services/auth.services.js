import bcrypt from 'bcryptjs';
import Auth from '../db/models/users.model';
import Activation from '../db/models/accountActivation.model';

export default {

  async encrptPassword(password) {
    const pass = await bcrypt.hash(password, 8);
    return pass;
  },

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
        error: 'Error checking email'
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
        error: 'Error checking username'
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
