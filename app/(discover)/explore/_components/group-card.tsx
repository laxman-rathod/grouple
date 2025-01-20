import { Card } from "@/components/ui/card"
import { GroupCardProps } from "@/constants/discover"
import { truncateString } from "@/lib/utils"
import Link from "next/link"

const GroupCard = ({
  id,
  name,
  userId,
  createdAt,
  category,
  description,
  thumbnail,
  preview,
  privacy,
}: GroupCardProps) => {
  return (
    <Link href={`/about/${id}`}>
      <Card className="bg-themeBlack border-themeGray rounded-xl overflow-hidden">
        <img
          src={preview || `https://ucarecdn.com/${thumbnail}/`}
          alt="thumbnail"
          className="w-full opacity-70 h-56"
        />
        <div className="-m-6">
          <h3 className="text-lg text-themeTextGray font-bold">{name}</h3>
          <p className="text-base text-themeTextGray">
            {description && truncateString(description)}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export default GroupCard
