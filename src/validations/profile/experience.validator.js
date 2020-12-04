import { check, validationResult } from 'express-validator';

/**
 *Contains Experience Validator
 *
 *
 *
 * @class Experience
 */
class ExperienceValidator {
  /**
   * validate user data.
   * @memberof Achievement
   * @returns {null} - No response.
   */
  static validateData() {
    return [
      check('teamName').not().isEmpty().withMessage('team name is required'),
      check('competitionType')
        .not()
        .isEmpty()
        .withMessage('competition type is required'),
      check('startMonth')
        .not()
        .isEmpty()
        .withMessage('start month is required'),
      check('startYear').not().isEmpty().withMessage('start Year is required'),
      check('keyAchievements')
        .not()
        .isEmpty()
        .withMessage('key achievements is required'),
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
    return next();
  }
}

export default ExperienceValidator;
