export interface RecruiterProfileResponse  {
  id: string
  about: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    phone: string
    avatarUrl: string
    isVerified: boolean
    createdAt: Date
    updatedAt: Date
  }
  company: {
    id: string
    name: string
    description: string
    website: string
    createdBy: string
    logoUrl: string
    createdAt: Date
    updatedAt: Date
  }
  position: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
  }
}
