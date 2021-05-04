import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import UserModel from '../db/models/user.model';

const router = express.Router();

router.get('/:searchText', authMiddleware, async (req, res) => {
  const { searchText } = req.params;
  const userId = req.data.id;

  if (searchText.length === 0) return;

  try {
    const results = await UserModel.find({
      fullName: { $regex: searchText, $options: 'i' },
    });

    //filter the user doing the search out
    const resultsToBeSent =
      results.length > 0 &&
      results.filter((result) => result._id.toString() !== userId);

    res.json(resultsToBeSent);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server error');
  }
});

export default router;
