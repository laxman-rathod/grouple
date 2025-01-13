"use client"

import { Label } from "@/components/ui/label"
import { Swiper, SwiperProps } from "swiper/react"
import { Navigation, Autoplay, FreeMode, Pagination } from "swiper/modules"

type SliderProps = {
  children: React.ReactNode
  overlay?: boolean
  label?: string
} & SwiperProps

const Slider = ({ children, overlay, label, ...rest }: SliderProps) => {
  return (
    <div className="w-full max-w-full overflow-x-hidden mt-5 relative">
      {overlay && (
        <>
          <div className="absolute w-[40px] slider-overlay left-0 h-full z-50" />
          <div className="absolute w-[40px] slider-overlay-rev right-0 h-full z-50" />
        </>
      )}
      {label && <Label className="pl-7 mb-3 text-themeGray">{label}</Label>}
      <Swiper modules={[Navigation, Pagination, Autoplay, FreeMode]} {...rest}>
        {children}
      </Swiper>
    </div>
  )
}

export default Slider
