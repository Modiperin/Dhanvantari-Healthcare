import { cn } from "../../lib/utils";

const HorizontalLine = ({ className = "" }) => (
  <div className={cn("border-b border-light-blue", className)} />
);

export default HorizontalLine;
