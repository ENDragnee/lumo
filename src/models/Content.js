// models/Content.js
import mdb from '@/lib/mongodb';

const contentSchema = new mdb.Schema({
  grade: { type: String, required: true },
  course: { type: String, required: true },
  chapter: { type: String, required: true },
  sub_chapter: { type: String, required: true },
  org: { type: String, required: true }
}, {
  timestamps: true
});

export const Content = mdb.models.Content || mdb.model('Content', contentSchema);