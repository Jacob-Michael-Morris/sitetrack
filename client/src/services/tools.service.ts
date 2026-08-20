import type { Tool } from '../types/Tool'

const API_URL = 'http://localhost:3000/api/tools'

export async function getTools(): Promise<Tool[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Unable to retrieve tools')
  }

  return response.json()
}