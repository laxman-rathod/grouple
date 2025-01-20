import { upload } from "@/lib/uploadcare"
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
  TextQuote,
  Video,
} from "lucide-react"
import { Command, createSuggestionItems, renderItems } from "novel/extensions"
import React from "react"

const createCommand = (editor: any, range: any, callback: () => void) => {
  editor.chain().focus().deleteRange(range).run()
  callback()
}

const createHeadingCommand = (level: number) => ({
  title: `Heading ${level}`,
  description: "Big section heading.",
  searchTerms: ["title", "big", "large", "heading"],
  icon: React.createElement([Heading1, Heading2, Heading3][level - 1], {
    size: 18,
  }),
  command: ({ editor, range }: any) => {
    createCommand(editor, range, () => {
      editor.chain().focus().setNode("heading", { level }).run()
    })
  },
})

export const suggestionItems = createSuggestionItems([
  {
    title: "Send Feedback",
    description: "Let us know how we can improve.",
    icon: <MessageSquarePlus size={18} />,
    command: ({ editor, range }: any) => {
      createCommand(editor, range, () => {
        window.open("/feedback", "_blank")
      })
    },
  },
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <Text size={18} />,
    command: ({ editor, range }: any) => {
      createCommand(editor, range, () => {
        editor.chain().focus().toggleNode("paragraph", "paragraph").run()
      })
    },
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "checkbox", "checklist"],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }: any) => {
      createCommand(editor, range, () => {
        editor.chain().focus().toggleTaskList().run()
      })
    },
  },
  createHeadingCommand(1),
  createHeadingCommand(2),
  createHeadingCommand(3),
  {
    title: "Bullet List",
    description: "Create a simple bulleted list.",
    searchTerms: ["list", "bullet", "unordered", "point"],
    icon: <List size={18} />,
    command: ({ editor, range }: any) => {
      createCommand(editor, range, () => {
        editor.chain().focus().toggleBulletList().run()
      })
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["list", "numbered", "ordered"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }: any) => {
      createCommand(editor, range, () => {
        editor.chain().focus().toggleOrderedList().run()
      })
    },
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["quote", "blockquote"],
    icon: <TextQuote size={18} />,
    command: ({ editor, range }: any) => {
      createCommand(editor, range, () => {
        editor
          .chain()
          .focus()
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run()
      })
    },
  },
  {
    title: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["code", "snippet", "codeblock"],
    icon: <Code size={18} />,
    command: ({ editor, range }: any) => {
      createCommand(editor, range, () => {
        editor.chain().focus().toggleCodeBlock().run()
      })
    },
  },
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["image", "picture", "photo", "media"],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }: any) => {
      createCommand(editor, range, () => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = async () => {
          if (input.files?.length) {
            const file = input.files[0]
            const uploaded = await upload.uploadFile(file)
            const imgsrc = `https://ucarecdn.com/${uploaded.uuid}/`
            if (imgsrc) {
              editor.commands.insertContent([
                {
                  type: "image",
                  attrs: {
                    src: imgsrc,
                    alt: "image",
                  },
                },
              ])
            }
          }
        }
        input.click()
      })
    },
  },
  {
    title: "Loom/YouTube",
    description: "Embed a video from Loom or YouTube.",
    icon: <Video size={18} />,
    command: ({ editor, range }: any) => {
      createCommand(editor, range, () => {
        const videoSrc = window.prompt("Video URL")
        if (videoSrc?.length) {
          editor.commands.insertContent([
            {
              type: "video",
              attrs: {
                src: videoSrc,
              },
            },
          ])
        }
      })
    },
  },
])

export const slashCommands = Command.configure({
  Suggestion: {
    items: () => suggestionItems,
    return: renderItems,
  },
})
