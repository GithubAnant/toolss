/**
 * InfiniteGrid - Scrollable image grid with animations
 * 
 * What it does:
 * • Shows images in a grid that scrolls forever
 * • Images pop up with a scale animation (start small → grow to full size)
 * • Only renders what you can see (using TanStack Virtual)
 * 
 * Performance:
 * • 120 FPS for normal scrolling (up/down or left/right)
 * • Diagonal scrolling is custom-coded (slightly laggy but feels better)
 * 
 * How it works:
 * • Loads more rows/columns as you scroll near the edge
 * • Each image animates in with a small delay (staggered effect)
 * • Cleans up animations when images go off-screen
 */

import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface SelectedImage {
  url: string;
  row: number;
  col: number;
}

interface InfiniteGridProps {
  onImageClick?: (imageData: SelectedImage) => void;
  animationType?: 'default' | 'polkadot' | 'disabled';
  disableCustomScroll?: boolean;
}

export default function InfiniteGrid({ onImageClick, animationType = 'default', disableCustomScroll = false }: InfiniteGridProps) {  
  // Configuration
  const PADDING_X = 80; // Horizontal padding between images
  const PADDING_Y = 80; // Vertical padding between images
  
  const [rowCount, setRowCount] = React.useState(10);
  const [colCount, setColCount] = React.useState(10);
  
  // Track which cells are currently animated
  const [animatedCells, setAnimatedCells] = React.useState(new Set<string>());
  const timeoutsRef = React.useRef(new Map<string, ReturnType<typeof setTimeout>>());
  
  const parentRef = React.useRef<HTMLDivElement>(null);
  

  // Sample image URLs
  const sampleImages = [
    "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687221038-404cb8830901?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687218608-5e2522b04673?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687219356-e820ca126c92?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687220566-5599dbbebf11?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687221073-53ad74c2cad7?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687219640-b3f11f4b7234?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687220923-c58b9a4592ae?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687221080-5cb261c645cb?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687220208-22d7a2543e88?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687221213-56e250b36fdd?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687220336-bbd659a734e7?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1682687221248-3116ba6ab483?w=400&h=400&fit=crop"
  ];

  // Get image for a specific cell
  const getImageForCell = (row: number, col: number) => {
    const index = (row * 1000 + col) % sampleImages.length;
    return sampleImages[index];
  };

  // Generate fixed sizes for consistent infinite scrolling (including padding)
  const cellSize = 200; // Base cell size
  const rows = React.useMemo(() => 
    new Array(rowCount).fill(cellSize + PADDING_Y), 
    [rowCount, PADDING_Y]
  );
  const columns = React.useMemo(() => 
    new Array(colCount).fill(cellSize + PADDING_X), 
    [colCount, PADDING_X]
  );


  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => rows[i] || (cellSize + PADDING_Y),
    overscan: 1,
  });

  const columnVirtualizer = useVirtualizer({
    count: colCount,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => columns[i] || (cellSize + PADDING_X),
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

  // Handle staggered animation for visible cells
  React.useEffect(() => {
    // Clear existing timeouts for cells that are no longer visible
    const currentTimeouts = timeoutsRef.current;
    currentTimeouts.forEach((timeout, cellKey) => {
      if (!visibleCellKeys.has(cellKey)) {
        clearTimeout(timeout);
        currentTimeouts.delete(cellKey);
      }
    });
    
    const newVisibleCells = Array.from(visibleCellKeys);
    const cellsToAnimate = newVisibleCells.filter(cellKey => !currentTimeouts.has(cellKey));
    
    if (animationType === 'disabled') {
      // No animation - all cells appear immediately
      cellsToAnimate.forEach((cellKey) => {
        setAnimatedCells(prev => new Set(prev).add(cellKey));
      });
    } else if (animationType === 'polkadot') {
      // Create polka dot/whack-a-mole effect by randomizing the order
      // but ensuring cells animate in clusters rather than pure random
      
      // Group cells by distance from center of visible area to create wave-like pattern
      const centerRow = (virtualRows[0]?.index || 0) + Math.floor(virtualRows.length / 2);
      const centerCol = (virtualColumns[0]?.index || 0) + Math.floor(virtualColumns.length / 2);
      
      // Sort by distance from center with some randomness
      cellsToAnimate.sort((a, b) => {
        const [aRow, aCol] = a.split('-').map(Number);
        const [bRow, bCol] = b.split('-').map(Number);
        
        // Calculate manhattan distance from center
        const aDist = Math.abs(aRow - centerRow) + Math.abs(aCol - centerCol);
        const bDist = Math.abs(bRow - centerRow) + Math.abs(bCol - centerCol);
        
        // Add randomness to create polka dot effect
        const aRandom = (aRow * 13 + aCol * 17) % 7;
        const bRandom = (bRow * 13 + bCol * 17) % 7;
        
        return (aDist + aRandom) - (bDist + bRandom);
      });
      
      cellsToAnimate.forEach((cellKey, index) => {
        // Use shorter delays for snappier whack-a-mole effect
        const baseDelay = 30;
        const randomOffset = Math.random() * 15;
        const delay = index * baseDelay + randomOffset;
        
        const timeout = setTimeout(() => {
          setAnimatedCells(prev => new Set(prev).add(cellKey));
          currentTimeouts.delete(cellKey);
        }, delay);
        currentTimeouts.set(cellKey, timeout);
      });
    } else {
      // Default animation: simple sequential stagger
      cellsToAnimate.forEach((cellKey, index) => {
        const delay = index * 20;
        const timeout = setTimeout(() => {
          setAnimatedCells(prev => new Set(prev).add(cellKey));
          currentTimeouts.delete(cellKey);
        }, delay);
        currentTimeouts.set(cellKey, timeout);
      });
    }
    
    // Clean up animated cells that are no longer visible
    setAnimatedCells(prev => {
      const newAnimated = new Set<string>();
      prev.forEach(cellKey => {
        if (visibleCellKeys.has(cellKey)) {
          newAnimated.add(cellKey);
        }
      });
      return newAnimated;
    });
  }, [visibleCellKeys, virtualRows, virtualColumns, animationType]);

  // Infinite scrolling logic
  React.useEffect(() => {
    if (virtualRows.length === 0 || virtualColumns.length === 0) return;
    
    const lastRowItem = virtualRows[virtualRows.length - 1];
    const lastColItem = virtualColumns[virtualColumns.length - 1];

    // Load more rows when approaching the end
    if (lastRowItem.index >= rowCount - 5) {
      setRowCount((old) => old + 1);
    }

    // Load more columns when approaching the end
    if (lastColItem.index >= colCount - 5) {
      setColCount((old) => old + 1);
    }
  }, [virtualRows, virtualColumns, rowCount, colCount]);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);
  
  // Custom smooth diagonal scrolling
  React.useEffect(() => {
    const container = parentRef.current;
    if (!container || disableCustomScroll) return;
    
    // Custom diagonal wheel handling with smooth interpolation
    let targetScrollX = container.scrollLeft;
    let targetScrollY = container.scrollTop;
    let isAnimating = false;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Update target positions based on wheel deltas
      targetScrollX += e.deltaX;
      targetScrollY += e.deltaY;
      
      // Clamp values to scroll bounds
      const maxScrollX = container.scrollWidth - container.clientWidth;
      const maxScrollY = container.scrollHeight - container.clientHeight;
      
      targetScrollX = Math.max(0, Math.min(maxScrollX, targetScrollX));
      targetScrollY = Math.max(0, Math.min(maxScrollY, targetScrollY));
      
      if (!isAnimating) {
        isAnimating = true;
        animateScroll();
      }
    };
    
    // Smooth animation loop using linear interpolation
    const animateScroll = () => {
      const currentX = container.scrollLeft;
      const currentY = container.scrollTop;
      
      // Linear interpolation for smooth scrolling
      const lerp = .04;
      const newX = currentX + (targetScrollX - currentX) * lerp;
      const newY = currentY + (targetScrollY - currentY) * lerp;
      
      container.scrollLeft = newX;
      container.scrollTop = newY;
      
      // Continue animation if we haven't reached the target
      const deltaX = Math.abs(targetScrollX - newX);
      const deltaY = Math.abs(targetScrollY - newY);
      
      if (deltaX > 0.5 || deltaY > 0.5) {
        requestAnimationFrame(animateScroll);
      } else {
        isAnimating = false;
        // Snap to final position
        container.scrollLeft = targetScrollX;
        container.scrollTop = targetScrollY;
      }
    };
    
    // Add wheel listener with preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [disableCustomScroll]);
  
  
  

  return (
    <div className="  h-dvh w-dvw flex justify-center items-center">
      <div 
        ref={parentRef}
        className="h-full w-full overflow-auto"
        style={{
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-x pan-y', // Enable native diagonal touch scrolling
          // border: '2px solid #fff',
          // borderRadius: '12px',
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
                const isAnimated = animatedCells.has(cellKey);
                
                return (
                  <div
                    key={`${virtualRow.key}-${virtualColumn.key}`}
                    className="grid-cell cursor-pointer"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      
                      // Transform with padding and blur-fade animation based on animated state
                      transform: `translateX(${virtualColumn.start + PADDING_X/2}px) translateY(${virtualRow.start + PADDING_Y/2}px) scale(${isAnimated ? 1 : 0.0})`,
                      opacity: isAnimated ? 1 : 0,
                      filter: isAnimated ? 'blur(0px)' : 'blur(8px)',
                      
                      // Animation type specific transition
                      transition: animationType === 'disabled' 
                        ? 'none' // No transition for disabled
                        : animationType === 'polkadot' 
                          ? 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' // Bouncy whack-a-mole
                          : 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1)', // Smooth default
                    }}
                    onClick={() => {
                      if (onImageClick && isAnimated) {
                        onImageClick({
                          url: getImageForCell(virtualRow.index, virtualColumn.index),
                          row: virtualRow.index,
                          col: virtualColumn.index
                        });
                      }
                    }}
                  >
                    <img
                      src={getImageForCell(virtualRow.index, virtualColumn.index)}
                      alt={`Cell ${virtualRow.index}, ${virtualColumn.index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      loading="lazy"
                    />
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