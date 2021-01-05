import { check, validationResult } from 'express-validator';

/**
 *Contains Association Validator
 *
 *
 *
 * @class Association
 */
class AssociationValidator {
  /**
   * validate user data.
   * @memberof Achievement
   * @returns {null} - No response.
   */
  static validateData() {
    return [
      check('associationName')
        .not()
        .isEmpty()
        .withMessage('association name is required'),
      check('associationType')
        .not()
        .isEmpty()
        .withMessage('association type is required'),
      check('issueMonth')
        .not()
        .isEmpty()
        .withMessage('Issued Month is required'),
      check('issueYear').not().isEmpty().withMessage('issueYear is required'),
    ];
  }

  /**
   * Validation results.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @param {Response} next - The next parameter.
   * @memberof SignUp
   * @returns {JSON} - A JSON success .
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

export default AssociationValidator;
