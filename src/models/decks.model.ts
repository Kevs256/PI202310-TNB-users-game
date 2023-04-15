import mongoose from 'mongoose';

const DecksModel = mongoose.model('Deck', new mongoose.Schema({
  _id: String,
  heroe: String,
  armors: [String],
  weapon: [String],
  items: [String],
  epics: [String],
}));

export default DecksModel;