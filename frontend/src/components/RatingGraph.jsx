import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const RatingGraph = ({ stats }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  
  const contestHistory = stats?.contestHistory || [];
  
  // If no contest history, return empty
  if (!contestHistory || contestHistory.length === 0) {
    return (
      <motion.div variants={itemVariants} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm text-center">
        <p className="text-gray-300">No contest history found</p>
      </motion.div>
    );
  }
  
  const currentRating = stats?.rating || contestHistory[contestHistory.length - 1]?.rating || 'N/A';
  
  // Find min and max ratings to set the y-axis scale
  const minRating = Math.min(...contestHistory.map(c => c.rating)) - 10;
  const maxRating = Math.max(...contestHistory.map(c => c.rating)) + 10;
  const ratingRange = maxRating - minRating;
  
  // Calculate the graph dimensions
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const graphWidth = 100 * contestHistory.length;
  const graphHeight = 300;
  
  // Handle touch or mouse events
  const handlePointClick = (contest, index, event) => {
    // Get position relative to the SVG
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - svgRect.left;
      const y = event.clientY - svgRect.top;
      
      setSelectedPoint(contest);
      setTooltipPosition({ x, y });
    }
  };
  
  // Zoom handling
  const handleWheel = (e) => {
    e.preventDefault();
    const newZoom = Math.max(0.5, Math.min(3, zoomLevel - e.deltaY * 0.001));
    setZoomLevel(newZoom);
  };
  
  // Pan handling
  const handleMouseDown = (e) => {
    if (e.button === 0) { // Only for left mouse button
      setIsDragging(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isDragging, startPan]);
  
  // Create the path for the line graph
  const createLinePath = () => {
    const pointWidth = graphWidth / (contestHistory.length - 1);
    
    return contestHistory.map((contest, i) => {
      const x = i * pointWidth;
      const y = graphHeight - ((contest.rating - minRating) / ratingRange) * graphHeight;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  };
  
  // Create the path for the area under the line
  const createAreaPath = () => {
    const pointWidth = graphWidth / (contestHistory.length - 1);
    const path = contestHistory.map((contest, i) => {
      const x = i * pointWidth;
      const y = graphHeight - ((contest.rating - minRating) / ratingRange) * graphHeight;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
    
    // Add the bottom corners to close the path
    return `${path} L${(contestHistory.length - 1) * pointWidth},${graphHeight} L0,${graphHeight} Z`;
  };
  
  // Calculate y-axis ticks
  const yTicks = [];
  const tickCount = 5;
  for (let i = 0; i <= tickCount; i++) {
    const rating = minRating + (ratingRange / tickCount) * i;
    const y = graphHeight - ((rating - minRating) / ratingRange) * graphHeight;
    yTicks.push({ rating: Math.round(rating), y });
  }
  
  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="flex justify-between mb-4">
        <div>
          <div className="text-3xl font-bold text-white">{currentRating}</div>
          <div className="text-gray-400 text-sm">
            {contestHistory[contestHistory.length - 1]?.date || ""}
          </div>
          <div className="text-gray-400 text-sm">
            {contestHistory[contestHistory.length - 1]?.contest?.title || ""}
          </div>
          <div className="text-gray-400 text-sm">
            Rank:{contestHistory[contestHistory.length - 1]?.ranking || ""}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded" 
            onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.1))}
          >
            Zoom +
          </button>
          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded" 
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
          >
            Zoom -
          </button>
          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded" 
            onClick={() => {setZoomLevel(1); setPan({x: 0, y: 0});}}
          >
            Reset
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="relative h-80 w-full overflow-hidden cursor-grab"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <svg 
          ref={svgRef}
          className="h-full w-full"
          viewBox={`0 0 ${graphWidth} ${graphHeight + padding.top + padding.bottom}`}
          preserveAspectRatio="none"
          style={{
            transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center',
            transition: 'transform 0.1s ease'
          }}
        >
          <defs>
            <linearGradient id="ratingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Y-axis ticks */}
          {yTicks.map((tick, i) => (
            <g key={`y-tick-${i}`} transform={`translate(0, ${padding.top + tick.y})`}>
              <line x1="0" y1="0" x2={graphWidth} y2="0" stroke="#4B5563" strokeWidth="1" strokeDasharray="4" />
              <text x="-5" y="3" textAnchor="end" fill="#9CA3AF" fontSize="10">
                {tick.rating}
              </text>
            </g>
          ))}
          
          {/* Graph area */}
          <g transform={`translate(0, ${padding.top})`}>
            {/* Area under the line */}
            <path
              d={createAreaPath()}
              fill="url(#ratingGradient)"
            />
            
            {/* Line */}
            <path
              d={createLinePath()}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Points */}
            {contestHistory.map((contest, i) => {
              const pointWidth = graphWidth / (contestHistory.length - 1);
              const x = i * pointWidth;
              const y = graphHeight - ((contest.rating - minRating) / ratingRange) * graphHeight;
              
              return (
                <g key={`point-${i}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={selectedPoint === contest ? 6 : 4}
                    fill={selectedPoint === contest ? "#ffffff" : "#f59e0b"}
                    stroke="#ffffff"
                    strokeWidth="1"
                    onClick={(e) => handlePointClick(contest, i, e)}
                    style={{ cursor: 'pointer' }}
                  />
                </g>
              );
            })}
          </g>
        </svg>
        
        {/* Tooltip */}
        {selectedPoint && (
          <div 
            className="absolute bg-gray-800 text-white p-2 rounded shadow-lg text-xs"
            style={{ 
              left: `${tooltipPosition.x}px`, 
              top: `${tooltipPosition.y - 70}px`,
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            <div className="font-bold">{selectedPoint.contest?.title}</div>
            <div>Date: {selectedPoint.date}</div>
            <div>Rating: {selectedPoint.rating}</div>
            <div>Rank: {selectedPoint.ranking}</div>
          </div>
        )}
      </div>
      
      {/* Rating stats summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-gray-400 text-sm">Best Rating</p>
          <p className="text-xl font-bold text-white">
            {Math.max(...contestHistory.map(c => c.rating))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Best Rank</p>
          <p className="text-xl font-bold text-white">
            {Math.min(...contestHistory.map(c => c.ranking))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Contests</p>
          <p className="text-xl font-bold text-white">
            {contestHistory.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatingGraph;