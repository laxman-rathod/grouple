import { UseFormRegister } from "react-hook-form"
import { SwiperProps, SwiperSlide } from "swiper/react"
import Slider from "../slider"
import { GROUPLE_CONSTANTS } from "@/constants"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { GroupListItem } from "./list-item"

type Props = {
  overlay?: boolean
  label?: string
  register?: UseFormRegister<any>
  selected?: string
  route?: boolean
} & SwiperProps

export const GroupListSlider = ({
  overlay,
  label,
  register,
  selected,
  route,
  ...rest
}: Props) => {
  return (
    <Slider
      slidesPerView="auto"
      spaceBetween={10}
      loop
      freeMode
      label={label}
      overlay={overlay}
      {...rest}
    >
      {GROUPLE_CONSTANTS.groupList.map((group, index) => (
        <SwiperSlide key={group.id} className="content-width-slide">
          {!register ? (
            route ? (
              <Link href={`/explore/${group.path}`}>
                <GroupListItem {...group} selected={selected} />
              </Link>
            ) : (
              <GroupListItem {...group} />
            )
          ) : (
            index > 0 && (
              <Label htmlFor={`group-${group.id}`}>
                <span>
                  <Input
                    id={`group-${group.id}`}
                    type="radio"
                    value={group.path}
                    className="hidden"
                    {...register("category")}
                  />
                  <GroupListItem {...group} selected={selected} />
                </span>
              </Label>
            )
          )}
        </SwiperSlide>
      ))}
    </Slider>
  )
}
