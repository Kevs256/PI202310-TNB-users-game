import mongoose from 'mongoose';

const DecksModel = mongoose.model('Deck', new mongoose.Schema({
  id_user: String,
  hero: String,
  armors: [String],
  weapon: [String],
  items: [String],
  epics: [String],
}));

export default DecksModel;