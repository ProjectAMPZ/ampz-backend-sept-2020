import mongoose from 'mongoose';

const TalentLineupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  lineupId: {
    type: mongoose.Schema.ObjectId,
    ref: 'lineup',
  },
  status: {
    type: String,
    default: 'pending',
  },
  marketValue: {
    type: String,
  },
  contractEndMonth: {
    type: String,
  },
  contractEndYear: {
    type: String,
  },
});

const TalentLineup = mongoose.model('talentlineup', TalentLineupSchema);

export default TalentLineup;
