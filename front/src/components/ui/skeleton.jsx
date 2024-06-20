import { cn } from "../../lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-primary/10 ml-2", className)}
      {...props} />)
  );
}

export { Skeleton }
