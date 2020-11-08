import logger from '../config';
import Filter from '../db/models/filter.model';
/**
 *Contains Filter Controller
 *
 * @class FilterController
 */
class FilterController {
  /* eslint camelcase: 0 */

  /**
   * Create Filter.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async createFilter(req, res) {
    req.body.userId = req.data.id;
    try {
      const filter = await Filter.create(req.body);
      res.status(201).json({
        status: 'success',
        data: filter,
      });
    } catch (err) {
      // res.status(500).json({ status: 'error', error: 'Server error' });
    }
  }

  /**
   * update/edit Filter.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof postController
   * @returns {JSON} - A JSON success response.
   */
  static async updateFilter(req, res) {
    try {
      let filter = await Filter.findById({
        _id: req.params.filterId,
      });

      if (!filter) {
        return res
          .status(404)
          .json({ status: 'error', message: 'filter not found' });
      }

      filter = await Filter.findOneAndUpdate(
        { _id: req.params.filterId },
        req.body,
        {
          new: true,
        }
      );

      res.status(200).json({
        status: 'success',
        data: filter,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }

  /**
   * get single Filter.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof postController
   * @returns {JSON} - A JSON success response.
   */
  static async getFilter(req, res) {
    try {
      const filter = await Filter.findById({
        _id: req.params.filterId,
      });

      if (!filter) {
        return res
          .status(404)
          .json({ status: 'error', message: 'filter not found' });
      }

      res.status(200).json({
        status: 'success',
        data: filter,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }

  /**
   * get all Filters for a user.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof postController
   * @returns {JSON} - A JSON success response.
   */
  static async getFilters(req, res) {
    try {
      const filters = await Filter.find({
        userId: req.data.id,
      });

      res.status(200).json({
        status: 'success',
        count: filters.length,
        data: filters,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }

  /**
   * Delete Filter.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */
  static async deleteFilter(req, res) {
    try {
      const filter = await Filter.findById({
        _id: req.params.filterId,
      });

      if (!filter) {
        return res
          .status(404)
          .json({ status: '404 Not Found', error: 'filter not found' });
      }

      await filter.remove();

      res.status(200).json({
        status: 'success',
        message: 'filter deleted successfully',
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        error: 'Server error',
      });
    }
  }
}

export default FilterController;
