import FollowServices from '../services/user.services';

/**
 *Contains User Controller
 *
 * @class UserController
 */
class UserController {
  /* eslint camelcase: 0 */

  /**
   * like/unlike posts.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof PostController
   * @returns {JSON} - A JSON success response.
   */
  static async followUser(req, res) {
    try {
      let result1 = '';  
      const userId = req.data.id;
      const { profileId } = req.params;  
    
      const result = await FollowServices.followedByUser(profileId, userId, res);     
      if (result) {      
        result1 = await FollowServices.unFollowUser(profileId, userId, res);        
      } else {      
        result1 = await FollowServices.followUser(profileId, userId, res);
      }
      res.status(200).json({ status: 'success', data: result1});
    } catch (err) {
      res.status(500).json({ status: 'error', error: 'internal server error' });
    }
  }

}

export default UserController;
