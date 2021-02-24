import ChatMessage from '../db/models/chatMessage.model';

/**
 *Contains Watchlist Controller
 *
 * @class ChatController
 */
class ChatController {
  /* eslint camelcase: 0 */
  /**
   * Create Watchlist.
   * @param {Request} req - Response object.
   * @param {Response} res - The payload.
   * @memberof AuthController
   * @returns {JSON} - A JSON success response.
   */

  static async postChatMedia(req, res) {
    const chat = { mediaUrl: req.body.mediaUrl };
    const savedChat = await ChatMessage.create(chat);
    res.status(201).json({ status: 'sucesss', data: savedChat });
  }
}

export default ChatController;
