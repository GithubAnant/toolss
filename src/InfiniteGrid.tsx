import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function InfiniteGrid() {  
  const [rowCount, setRowCount] = React.useState(5);
  const [colCount, setColCount] = React.useState(5);
  
  // Track which cells have been animated
  const animatedCells = React.useRef(new Set<string>());
  
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

  // AnimatedCell component with blur-fade animation and staggered timing
  const AnimatedCell = React.memo(({ 
    rowIndex, 
    colIndex, 
    width, 
    height, 
    translateX,
    translateY,
    backgroundColor,
    isInView 
  }: {
    rowIndex: number;
    colIndex: number;
    width: string;
    height: string;
    translateX: number;
    translateY: number;
    backgroundColor: string;
    isInView: boolean;
  }) => {
    const cellKey = `${rowIndex}-${colIndex}`;
    const [hasAnimated, setHasAnimated] = React.useState(() => 
      animatedCells.current.has(cellKey)
    );
    
    // Calculate stagger delay based on position - creates wave effect
    const staggerDelay = React.useMemo(() => {
      const baseDelay = (rowIndex % 3) * 0.1 + (colIndex % 3) * 0.05;
      return Math.min(baseDelay, 0.4); // Cap at 400ms
    }, [rowIndex, colIndex]);
    
    React.useEffect(() => {
      if (isInView && !hasAnimated) {
        const timer = setTimeout(() => {
          animatedCells.current.add(cellKey);
          setHasAnimated(true);
        }, staggerDelay * 1000);
        
        return () => clearTimeout(timer);
      }
    }, [isInView, cellKey, hasAnimated, staggerDelay]);
    
    return (
      <div
        className="grid-cell"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height,
          backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '500',
          color: '#333',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          
          // Transform with blur-fade animation like Framer Motion
          transform: hasAnimated 
            ? `translateX(${translateX}px) translateY(${translateY}px) scale(1)` 
            : `translateX(${translateX}px) translateY(${translateY}px) scale(0.8)`,
          opacity: hasAnimated ? 1 : 0,
          filter: hasAnimated ? 'blur(0px)' : 'blur(10px)',
          
          // Smooth transition with spring-like easing
          transition: hasAnimated 
            ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
            : 'none',
        }}
      >
        Cell {rowIndex}, {colIndex}
      </div>
    );
  });

  AnimatedCell.displayName = 'AnimatedCell';

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

  // Get visible ranges
  const visibleRows = rowVirtualizer.getVirtualItems();
  const visibleColumns = columnVirtualizer.getVirtualItems();
  
  // Custom hook to detect if elements with transforms are in view
  const useTransformInView = React.useCallback(() => {
    const keys = new Set<string>();
    const container = parentRef.current;
    
    if (!container) return keys;
    
    const containerRect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    const scrollLeft = container.scrollLeft;
    const viewportHeight = containerRect.height;
    const viewportWidth = containerRect.width;
    
    // Animation trigger margin - start animation before fully in view
    const margin = 100;
    
    visibleRows.forEach(row => {
      visibleColumns.forEach(col => {
        // Calculate actual element position accounting for transforms
        const translateX = col.start;
        const translateY = row.start;
        const elementWidth = columns[col.index] || 200;
        const elementHeight = rows[row.index] || 200;
        
        // Element bounds relative to scroll container
        const elementTop = translateY;
        const elementLeft = translateX;
        const elementBottom = translateY + elementHeight;
        const elementRight = translateX + elementWidth;
        
        // Check if element is in viewport with margin
        const isInViewport = (
          elementTop < scrollTop + viewportHeight + margin &&
          elementBottom > scrollTop - margin &&
          elementLeft < scrollLeft + viewportWidth + margin &&
          elementRight > scrollLeft - margin
        );
        
        if (isInViewport) {
          keys.add(`${row.index}-${col.index}`);
        }
      });
    });
    
    return keys;
  }, [visibleRows, visibleColumns, rows, columns]);

  const visibleCellKeys = React.useMemo(() => {
    return useTransformInView();
  }, [useTransformInView]);

  // Infinite scrolling logic
  React.useEffect(() => {
    const [lastRowItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    const [lastColItem] = [...columnVirtualizer.getVirtualItems()].reverse();

    if (!lastRowItem || !lastColItem) {
      return;
    }


    // Load more rows when approaching the end
    if (lastRowItem.index >= rowCount - 5) {
      setRowCount((old) => old + 5);
    }

    // Load more columns when approaching the end
    if (lastColItem.index >= colCount - 5) {
      setColCount((old) => old + 5);
    }
  }, [
    rowVirtualizer.getVirtualItems(),
    columnVirtualizer.getVirtualItems(),
    rowCount,
    colCount,
  ]);

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
          scrollSnapType: 'both proximity',
          border: '2px solid #ddd',
          borderRadius: '12px',
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.3s ease',
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
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <React.Fragment key={virtualRow.key}>
              {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
                const cellKey = `${virtualRow.index}-${virtualColumn.index}`;
                const isInView = visibleCellKeys.has(cellKey);
                
                return (
                  <AnimatedCell
                    key={cellKey}
                    rowIndex={virtualRow.index}
                    colIndex={virtualColumn.index}
                    width={`${columns[virtualColumn.index]}px`}
                    height={`${rows[virtualRow.index]}px`}
                    translateX={virtualColumn.start}
                    translateY={virtualRow.start}
                    backgroundColor={getStableColor(virtualRow.index, virtualColumn.index)}
                    isInView={isInView}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}