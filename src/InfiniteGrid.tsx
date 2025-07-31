import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export default function InfiniteGrid() {  
  const [rowCount, setRowCount] = React.useState(10);
  const [colCount, setColCount] = React.useState(10);
  
  // Track which cells are currently visible
  const [visibleCells, setVisibleCells] = React.useState(new Set<string>());
  
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
    overscan: 1,
  });

  const columnVirtualizer = useVirtualizer({
    count: colCount,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => columns[i] || 200,
    overscan: 1,
    horizontal: true,
  });

  // Get the virtual items - these are the ones that are visible (plus overscan)
  const virtualRows = rowVirtualizer.getVirtualItems();
  const virtualColumns = columnVirtualizer.getVirtualItems();

  // Create a set of currently visible cell keys
  const visibleCellKeys = React.useMemo(() => {
    const keys = new Set<string>();
    virtualRows.forEach(row => {
      virtualColumns.forEach(col => {
        keys.add(`${row.index}-${col.index}`);
      });
    });
    return keys;
  }, [virtualRows, virtualColumns]);

  // Update visible cells set
  React.useEffect(() => {
    setVisibleCells(visibleCellKeys);
  }, [visibleCellKeys]);

  // Infinite scrolling logic
  React.useEffect(() => {
    if (virtualRows.length === 0 || virtualColumns.length === 0) return;
    
    const lastRowItem = virtualRows[virtualRows.length - 1];
    const lastColItem = virtualColumns[virtualColumns.length - 1];

    // Load more rows when approaching the end
    if (lastRowItem.index >= rowCount - 5) {
      setRowCount((old) => old + 10);
    }

    // Load more columns when approaching the end
    if (lastColItem.index >= colCount - 5) {
      setColCount((old) => old + 10);
    }
  }, [virtualRows, virtualColumns, rowCount, colCount]);

  return (
    <div className="container" style={{ 
      width: '100vw', 
      height: '100vh', 
      padding: '20px',
      background: '#f5f5f5',
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
          Infinite Virtual Grid with Animations
        </h2>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          Scroll in any direction to load more cells. Each cell animates when it enters the viewport.
        </p>
        <p style={{ fontSize: '14px', color: '#888' }}>
          Grid size: {rowCount} rows × {colCount} columns = {rowCount * colCount} total cells
        </p>
      </div>
      
      <div 
        ref={parentRef}
        className="List"
        style={{
          height: 'calc(100vh - 140px)',
          width: '100%',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          border: '2px solid #ddd',
          borderRadius: '12px',
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          position: 'relative'
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `${columnVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {virtualRows.map((virtualRow) => (
            <React.Fragment key={virtualRow.key}>
              {virtualColumns.map((virtualColumn) => {
                const cellKey = `${virtualRow.index}-${virtualColumn.index}`;
                const isVisible = visibleCells.has(cellKey);
                
                return (
                  <div
                    key={`${virtualRow.key}-${virtualColumn.key}`}
                    className="grid-cell"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: `${virtualColumn.size}px`,
                      height: `${virtualRow.size}px`,
                      backgroundColor: getStableColor(virtualRow.index, virtualColumn.index),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#333',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      
                      // Transform with blur-fade animation - no stagger
                      transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px) scale(${isVisible ? 1 : 0.0})`,
                      opacity: isVisible ? 1 : 0,
                      filter: isVisible ? 'blur(0px)' : 'blur(8px)',
                      
                      // Immediate transition when cell becomes visible
                      transition: 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1)',
                    }}
                  >
                    Cell {virtualRow.index}, {virtualColumn.index}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}