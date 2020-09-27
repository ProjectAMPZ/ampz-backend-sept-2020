import { check, validationResult } from 'express-validator';

/**
 *Contains Bio Role Validator
 *
 *
 *
 * @class BioRole
 */
class BioRoleValidator {
  /**
   * validate user data.
   * @memberof Feature
   * @returns {null} - No response.
   */
  static validateData() {
    return [check('role').not().isEmpty().withMessage('Please Select a role')];
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

export default BioRoleValidator;
