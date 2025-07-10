import { ObjectId } from 'mongoose'
export interface HistoryItem {
  _id: string
  content_id: {
    _id: ObjectId
    title: string
    tags: [string]
  }
  starred_status: boolean
  viewed_at: string
  progress: number
}
