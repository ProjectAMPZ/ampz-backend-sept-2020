import { check, validationResult } from 'express-validator';

/**
 *Contains Achievement Validator
 *
 *
 *
 * @class Achievement
 */
class AchievementValidator {
  /**
   * validate user data.
   * @memberof Achievement
   * @returns {null} - No response.
   */
  static validateData() {
    return [
      check('title').not().isEmpty().withMessage('title is required'),
      check('month').not().isEmpty().withMessage('month is required'),
      check('year').not().isEmpty().withMessage('year is required'),
      check('description')
        .not()
        .isEmpty()
        .withMessage('description is required'),
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
  static async ValidationResult(req, res, next) {
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

export default AchievementValidator;
