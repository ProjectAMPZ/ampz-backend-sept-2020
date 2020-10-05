import { check, validationResult } from 'express-validator';

/**
 *Contains Comment Validator
 *
 *
 *
 * @class Post
 */
class CommentValidator {
  /**
   * validate user data.
   * @memberof Post
   * @returns {null} - No response.
   */
  static validateData() {
    return [
      check('category')
        .not()
        .isEmpty()
        .withMessage('Enter category')
    ];
  }

  /**
   * Validation results.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @param {Response} next - The next parameter.
   * @memberof SignUp
   * @returns {JSON} - A JSON success response.
   */
  static async myValidationResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArr = errors.array().map(({ msg }) => msg);
      return res.status(400).json({
        status: '400 Invalid Request',
        error: 'Your request contains invalid parameters',
        errors: errArr,
      });
    }
    next();
  }
}

export default CommentValidator;
