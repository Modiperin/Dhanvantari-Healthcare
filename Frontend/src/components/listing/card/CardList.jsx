const CardList = ({
  data = [],
  renderCard,
  columns = { base: 1, md: 1, lg: 1, xl: 2 },
  gap = "gap-x-2 gap-y-0",
  emptyText = "No data found.",
}) => {
  // Build Tailwind grid classes based on columns prop
  const gridCols = [
    `grid-cols-${columns.base || 1}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`grid ${gridCols} ${gap}`}>
      {data && data.length > 0 ? (
        data.map((item, idx) => renderCard(item, idx))
      ) : (
        <div className="col-span-full text-center text-blue-400 py-10">
          {emptyText}
        </div>
      )}
    </div>
  );
};

export default CardList;
