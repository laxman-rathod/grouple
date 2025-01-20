export interface GroupCardProps {
  id: string
  name: string
  userId: string
  createdAt: Date
  category: string
  description: string | null
  thumbnail: string | null
  preview?: string
  privacy: "PUBLIC" | "PRIVATE"
}
