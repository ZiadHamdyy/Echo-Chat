import { Input } from "./input"
import { Label } from "./label"

export function InputWithLabel({textname, labeltext, onChange, className}) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={textname}>{labeltext}</Label>
      <Input type={textname} id={textname} placeholder={textname} onChange={onChange} className={className}/>
    </div>
  )
}