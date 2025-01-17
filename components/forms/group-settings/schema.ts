import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from "@/constants/upload-care"
import { z } from "zod"

export const GroupSettingsSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "name must have atleast 3 characters" })
      .optional()
      .or(z.literal("").transform(() => undefined)),
    description: z
      .string()
      .min(10, {
        message: "description must have atleast 10 characters",
      })
      .optional()
      .or(z.literal("").transform(() => undefined)),
    icon: z.any().optional(),
    thumbnail: z.any().optional(),
    htmldescription: z
      .string()
      .optional()
      .or(z.literal("").transform(() => undefined)),
    jsondescription: z
      .string()
      .min(10, {
        message: "description must have atleast 10 characters",
      })
      .optional()
      .or(z.literal("").transform(() => undefined)),
  })
  .refine(
    (schema) => {
      if (schema.icon?.length) {
        if (
          ACCEPTED_FILE_TYPES.includes(schema.icon?.[0].type!) &&
          schema.icon?.[0].size <= MAX_UPLOAD_SIZE
        ) {
          return true
        }
      }
      if (!schema.icon?.length) {
        return true
      }
    },
    {
      message:
        "The image must be less then 2MB, and on PNG, JPEG & JPG files are accepted",
      path: ["icon"],
    },
  )
  .refine(
    (schema) => {
      if (schema.thumbnail?.length) {
        if (
          ACCEPTED_FILE_TYPES.includes(schema.thumbnail?.[0].type!) &&
          schema.thumbnail?.[0].size <= MAX_UPLOAD_SIZE
        ) {
          return true
        }
      }
      if (!schema.thumbnail?.length) {
        return true
      }
    },
    {
      message:
        "The image must be less then 2MB, and on PNG, JPEG & JPG files are accepted",
      path: ["thumbnail"],
    },
  )
