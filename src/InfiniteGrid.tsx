import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function InfiniteGrid() {  
  const [rowCount, setRowCount] = React.useState(20);
  const [colCount, setColCount] = React.useState(20);
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Generate fixed sizes for consistent infinite scrolling
  const rows = React.useMemo(() => 
    new Array(rowCount).fill(200), 
    [rowCount]
  );
  const columns = React.useMemo(() => 
    new Array(colCount).fill(200), 
    [colCount]
  );

  const getStableColor = (row: number, col: number) => {
    const hash = (row * 1000 + col) % 360;
    return `hsl(${hash}, 70%, 80%)`;
  };

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => rows[i] || 200,
    overscan: 5,
  });

  const columnVirtualizer = useVirtualizer({
    count: colCount,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => columns[i] || 200,
    overscan: 5,
    horizontal: true,
  });

  // Infinite scrolling logic from the React Query example
  React.useEffect(() => {
    const [lastRowItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    const [lastColItem] = [...columnVirtualizer.getVirtualItems()].reverse();

    if (!lastRowItem || !lastColItem) {
      return;
    }

    // Load more rows when approaching the end
    if (lastRowItem.index >= rowCount - 5) {
      setRowCount((old) => old + 10);
    }

    // Load more columns when approaching the end
    if (lastColItem.index >= colCount - 5) {
      setColCount((old) => old + 10);
    }
  }, [
    rowVirtualizer.getVirtualItems(),
    columnVirtualizer.getVirtualItems(),
    rowCount,
    colCount,
  ]);

  return (
    <div 
      ref={parentRef}
      className="List"
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'both proximity',
        border: '1px solid #e6e4dc',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: `${columnVirtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <React.Fragment key={virtualRow.key}>
            {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
              <div
                key={`${virtualRow.index}-${virtualColumn.index}`}
                className="grid-cell"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${columns[virtualColumn.index]}px`,
                  height: `${rows[virtualRow.index]}px`,
                  transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                  backgroundColor: getStableColor(virtualRow.index, virtualColumn.index),
                  scrollSnapAlign: 'start',
                }}
              >
                Cell {virtualRow.index}, {virtualColumn.index}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}