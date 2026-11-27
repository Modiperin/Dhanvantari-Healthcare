import { Tooltip } from "antd";
import "../styles/ant.tooltip.css";

const TooltipWrapper = ({
  id,
  content,
  children,
  visible = true,
  place = "top",
  delayShow = 200,
  delayHide = 0,
}) => {
  if (!visible) {
    return <>{children}</>;
  }

  return (
    // The Ant Design Tooltip wraps the trigger element directly.
    // We use the `id` prop as the `key` to ensure React is happy if multiple are in a list.
    <Tooltip
      key={id}
      title={content} // Ant Design uses `title` instead of `content` for the text
      placement={place} // Placement names are compatible (e.g., "top", "right")
      mouseEnterDelay={delayShow / 1000} // Ant Design uses seconds, not milliseconds
      mouseLeaveDelay={delayHide / 1000}
    >
      {/* Ant Design's Tooltip requires a single DOM node as a child. */}
      {/* We wrap the children in a span to apply the cursor and custom style. */}
      <span style={{ cursor: "pointer" }}>{children}</span>
    </Tooltip>
  );
};

export default TooltipWrapper;
