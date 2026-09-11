export interface Jobsite {
  jobsite_id: number
  name: string
  location: string | null
  status: string
  start_date: string | null
  end_date: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface JobsiteInput {
  name: string
  location: string
  status: string
  start_date: string
  end_date: string
  description: string
}