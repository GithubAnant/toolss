import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function InfiniteGrid() {
  const [rowCount, setRowCount] = React.useState(20);
  const [colCount, setColCount] = React.useState(20);
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
    gap: 16,
    onChange: (instance, sync) => {
      if (!sync) {
        const items = instance.getVirtualItems();
        if (items.length) {
          const lastIndex = items[items.length - 1].index;
          if (lastIndex >= rowCount - 5) {
            setRowCount((old) => old + 10);
          }
        }
      }
    },
  });

  const columnVirtualizer = useVirtualizer({
    count: colCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
    horizontal: true,
    gap: 16,
    onChange: (instance, sync) => {
      if (!sync) {
        const items = instance.getVirtualItems();
        if (items.length) {
          const lastIndex = items[items.length - 1].index;
          if (lastIndex >= colCount - 5) {
            setColCount((old) => old + 10);
          }
        }
      }
    },
  });

  return (
    <div ref={parentRef} className="grid-container">
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
                  width: `${virtualColumn.size}px`,
                  height: `${virtualRow.size}px`,
                  transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                  backgroundColor: `hsl(${Math.random() * 360}, 70%, 80%)`,
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