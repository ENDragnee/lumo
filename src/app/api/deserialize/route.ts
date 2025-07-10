import connectDB from '@/lib/mongodb'
import Content, { IContent } from "@/models/Content"
import { NextRequest } from 'next/server'

interface SelectedData {
  data: string,
  title: string
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    let data: SelectedData | null = null

    if (id) {
      data = await Content.findById(id).select('data title -_id').exec()
    } else {
      data = await Content.findOne()
        .sort({ createdAt: -1 })
        .select('data title -_id')
        .exec()
    }

    if (!data) {
      return new Response(JSON.stringify({ error: 'No content found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ data: data.data, title: data.title }), {
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
