import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export default {

  async encrptPassword(password) {
    const pass = await bcrypt.hash(password, 8);
    return pass;
  },

  async verifyPassword(plainText, hashedText) {
    const isMatch = await bcrypt.compare(plainText, hashedText);
    return isMatch;
  },

  async randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  },

  async generateCode(num) {
    let randomNum = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < num; i++) {
      // eslint-disable-next-line no-await-in-loop
      randomNum += await this.randomIntInc(1, 10);
    }
    return randomNum;
  },

  async generateToken(id, role, userName) {
    const token = jwt.sign(
      {
        data: { id, role, userName }
      },
      process.env.SECRET || 'alternativeSecret',
      { expiresIn: '30d' }
    );
    return token;
  },

  // async verifyToken(token, req, res) {
  //   await jwt.verify(token, process.env.SECRET || 'alternativeSecret', (error, result) => {
  //     if (error) {
  //       return res.status(401).json({
  //         status: '401 Unauthorized',
  //         error: 'Access token is Invalid'
  //       });
  //     }
  //     req.body.payLoad = result.data;
  //     return true;
  //   });
  // }
};
