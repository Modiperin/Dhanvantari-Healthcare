const CardListSkeleton = ({
  count = 6,
  columns = { base: 1, md: 2, lg: 2, xl: 4 },
  gap = "gap-10",
  SkeletonComponent,
}) => {
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
      {Array.from({ length: count }).map((_, idx) =>
        SkeletonComponent ? <SkeletonComponent key={idx} /> : null
      )}
    </div>
  );
};

export default CardListSkeleton;
