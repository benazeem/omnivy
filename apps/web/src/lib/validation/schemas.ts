import { z } from "zod"

export const ClipSaveSchema = z.object({
  title: z.string().min(1, "Title must not be empty").max(256, "Title must not exceed 256 characters"),
  content: z.string().min(1, "Content must not be empty"),
  url: z.string().url("Origin URL must be a valid URL string").optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  folderId: z.string().optional(),
  provider: z.enum(["gdrive", "onedrive", "dropbox", "notion"]),
})

export const ProviderStatusSchema = z.object({
  provider: z.enum(["gdrive", "onedrive", "dropbox", "notion"]),
})

export type ClipSaveInput = z.infer<typeof ClipSaveSchema>
export type ProviderStatusInput = z.infer<typeof ProviderStatusSchema>
