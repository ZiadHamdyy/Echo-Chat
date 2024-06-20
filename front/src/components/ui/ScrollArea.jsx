import * as React from "react"

import { ScrollArea } from "../../components/ui/scroll-area"
import { Separator } from "../../components/ui/separator"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="bg-gray-300 h-5/6 w-3/6 rounded-md border">
      <div className="p-4">
        <div className="bg-slate-700 w-full">
          
          <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        </div>
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm">
              {tag}
            </div>
            <Separator className="my-6" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}
