import { check, validationResult } from 'express-validator';

/**
 *Contains Feature Validator
 *
 *
 *
 * @class Feature
 */
class FeatureValidator {
  /**
   * validate user data.
   * @memberof Feature
   * @returns {null} - No response.
   */
  static validateData() {
    return [
      check('sport').not().isEmpty().withMessage('Enter your sport'),
      check('preferedArm')
        .not()
        .isEmpty()
        .withMessage('Enter your prefered Arm'),
      check('preferedFoot')
        .not()
        .isEmpty()
        .withMessage('Enter your prefered Foot'),
      check('height').not().isEmpty().withMessage('Enter your height'),
      check('weight').not().isEmpty().withMessage('Enter your weight'),
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

export default FeatureValidator;
