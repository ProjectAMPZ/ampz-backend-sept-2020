import Association from '../db/models/association.model';

/**
 *Contains Association Controller and methods
 *
 * @class AssociationController
 */
class AssociationController {
  /* eslint camelcase: 0 */

  /**
   * Create profile association.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async createAssociation(req, res) {
    req.body.userId = req.data.id;
    try {
      const association = await Association.create(req.body);
      res.status(201).json({
        status: 'success',
        data: association,
      });
    } catch (err) {
      // res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }

  /**
   * update association.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof postController
   * @returns {JSON} - A JSON success response.
   */
  static async updateAssociation(req, res) {
    try {
      let association = await Association.findById({
        _id: req.params.associationId,
      });

      if (!association) {
        return res
          .status(404)
          .json({ status: 'error', message: 'association not found' });
      }

      association = await Association.findOneAndUpdate(
        { _id: req.params.associationId },
        req.body,
        {
          new: true,
        }
      );

      res.status(200).json({
        status: 'success',
        data: association,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }

  /**
   * get single association.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof postController
   * @returns {JSON} - A JSON success response.
   */
  static async getAssociation(req, res) {
    try {
      const association = await Association.findById({
        _id: req.params.associationId,
      });

      if (!association) {
        return res
          .status(404)
          .json({ status: 'error', message: 'association not found' });
      }

      res.status(200).json({
        status: 'success',
        data: association,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }

  /**
   * Delete Association.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async deleteAssociation(req, res) {
    try {
      const association = await Association.findById({
        _id: req.params.associationId,
      });

      if (!association) {
        return res
          .status(404)
          .json({ status: '404 Not Found', error: 'association not found' });
      }

      await association.remove();

      res.status(200).json({
        status: 'success',
        message: 'association deleted successfully',
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }
}

export default AssociationController;
