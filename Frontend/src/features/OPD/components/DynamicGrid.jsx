import { cn } from "../../../lib/utils";

const DynamicGrid = ({ data, grid = 3 }) => {
    const keys = Object.keys(data);
    const totalItems = keys.length;
    const itemsInLastRow = totalItems % grid;

    return (
        <div className={cn(`grid grid-cols-${grid}`, "px-4 gap-x-4 m-1 h-full")}>
            {keys.map((d, index) => {
                const isLastRow = index >= totalItems - itemsInLastRow;
                return (
                    <div
                        key={d}
                        className={cn(
                            "flex items-center gap-2 text-blue/60 py-2 text-sm",
                            !isLastRow && "border-b border-light-blue"
                        )}
                    >
                        {d}: <span className="text-blue">{data[d] || "N/A"}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default DynamicGrid;