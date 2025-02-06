import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

const SerializedDataSchema = new mongoose.Schema({
  data: String,
  createdAt: { type: Date, default: Date.now }
})

let SerializedData
try {
  SerializedData = mongoose.model('Content')
} catch (error) {
  SerializedData = mongoose.model('Content', SerializedDataSchema)
}

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    let data

    if (id) {
      data = await SerializedData.findById(id).select('data -_id').exec()
    } else {
      data = await SerializedData.findOne()
        .sort({ createdAt: -1 })
        .select('data -_id')
        .exec()
    }

    if (!data) {
      return new Response(JSON.stringify({ error: 'No content found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ data: data.data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}