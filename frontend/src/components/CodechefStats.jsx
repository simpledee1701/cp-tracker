import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, ChevronUp, ChevronDown, Award, Trophy, Activity, Star, Code, Users, TrendingUp, User } from 'lucide-react';

export default function CodeChefStats({ data }) {
  const [isLoading, setIsLoading] = useState(!data);
  const [profileData, setProfileData] = useState(data || null);
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    analysis: true,
    heatmap: true,
    contest: true
  });
  
  const heatmapRef = useRef(null);

  useEffect(() => {
    if (data) {
      setProfileData(data);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (profileData && profileData.submissionHeatmap && heatmapRef.current) {
      renderHeatmap(profileData.submissionHeatmap.heatmapData);
    }
  }, [profileData, expandedSections.heatmap]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderHeatmap = (heatmapData) => {
    if (!heatmapRef.current) return;
    
    // Clear previous content
    heatmapRef.current.innerHTML = '';
    
    // Setup variables
    const heatTheme = "day";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Create SVG elements
    const pivot = 35;
    const svgElement = createElementSvg('svg', { 
      width: '100%',
      height: 7 * 22 + 2 * pivot,
      viewBox: `0 0 ${30 * 20 + 2 * pivot} ${7 * 22 + 2 * pivot}`
    });
    
    const gElementContainer = createElementSvg('g', { 
      transform: `translate(${pivot}, ${pivot})` 
    });
    
    // Add header
    const headerContent = createElementSvg('text', { x: '0', y: '-10' });
    headerContent.textContent = 'Last 6 Months Activity';
    headerContent.classList.add('text-sm', 'font-semibold', 'fill-gray-200');
    gElementContainer.appendChild(headerContent);
    
    // Create tag element for tooltips
    const tagElement = document.createElement('div');
    tagElement.classList.add('absolute', 'bg-gray-800', 'text-white', 'px-2', 'py-1', 'rounded', 'text-xs', 'shadow-lg');
    tagElement.style.display = 'none';
    tagElement.style.zIndex = 50;
    heatmapRef.current.appendChild(tagElement);
    
    // Settings
    const settings = {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weeks: ['Mon', 'Wed', 'Fri', 'Sun'],
      showTomorrow: false,
      tomorrow: tomorrow
    };
    
    // Calculate days to show
    const dayCount = 26 * 7 + (settings.tomorrow.getDay() + 6) % 7;
    let monthCount;
    let k = 6;
    let calculatedDayCount = dayCount;
    
    // Calculate gap for month labels
    const gap = calculateGap(settings, calculatedDayCount);
    calculatedDayCount = dayCount; // Reset after calculation
    
    // Generate calendar grid
    for (let i = 0; i < 27; i++) {
      const gElement = createElementSvg('g', { transform: 'translate(' + 20 * i + ',0)' });
      
      const firstDate = new Date(settings.tomorrow);
      firstDate.setDate(settings.tomorrow.getDate() - calculatedDayCount - 1);
      
      const daysLeft = daysInMonth(firstDate) - firstDate.getDate();
      
      for (let j = firstDate.getDay(); j < 7; j++) {
        const rectDate = new Date(settings.tomorrow);
        rectDate.setDate(settings.tomorrow.getDate() - calculatedDayCount);
        
        // Add month labels
        if (rectDate.getMonth() !== monthCount && i < 52 && j > 3 && daysLeft > 7) {
          const textMonth = createElementSvg('text', { x: k, y: '160', class: 'month' });
          k += gap;
          textMonth.textContent = settings.months[rectDate.getMonth()];
          textMonth.classList.add('text-xs', 'fill-gray-300');
          gElementContainer.appendChild(textMonth);
          monthCount = rectDate.getMonth();
        }
        
        calculatedDayCount--;
        
        // Create day rectangles
        if (calculatedDayCount >= 0 || (settings.showTomorrow && calculatedDayCount >= -1)) {
          const dateStr = `${rectDate.getFullYear()}-${rectDate.getMonth() + 1}-${rectDate.getDate()}`;
          
          const rectElement = createElementSvg('rect', {
            class: heatTheme,
            width: '14px',
            height: '14px',
            rx: '2px',
            'data-date': dateStr,
            y: 20 * j,
          });
          
          rectElement.classList.add('fill-gray-600');
          
          // Add tooltip event listeners
          rectElement.addEventListener('mouseover', function() {
            const dateString = this.getAttribute('data-date').split('-');
            const date = new Date(dateString[0], dateString[1] - 1, dateString[2]);
            
            const tagDate = `${settings.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            const tagCount = this.getAttribute('data-count');
            let displayCount = 'No submissions';
            
            if (tagCount && parseInt(tagCount) > 0) {
              displayCount = `${tagCount} submissions`;
            }
            
            tagElement.innerHTML = `<div><b>${displayCount}</b> on ${tagDate}</div>`;
            tagElement.style.display = 'block';
            
            const rect = this.getBoundingClientRect();
            const heatmapRect = heatmapRef.current.getBoundingClientRect();
            
            tagElement.style.left = (rect.left - heatmapRect.left - (tagElement.offsetWidth / 2) + 7) + 'px';
            tagElement.style.top = (rect.top - heatmapRect.top - 30) + 'px';
          });
          
          rectElement.addEventListener('mouseleave', function() {
            tagElement.style.display = 'none';
          });
          
          gElement.appendChild(rectElement);
        }
      }
      
      gElementContainer.appendChild(gElement);
    }
    
    // Add day of week labels
    for (let i = 0; i < 7; i += 2) {
      const curDay = createElementSvg('text', { x: '-35', y: `${(20 * i) + 12}` });
      curDay.textContent = settings.weeks[i/2];
      curDay.classList.add('text-xs', 'fill-gray-300');
      gElementContainer.appendChild(curDay);
    }
    
    svgElement.appendChild(gElementContainer);
    heatmapRef.current.appendChild(svgElement);
    
    // Fill in the data
    fillData(heatmapData);
    
    // Helper function to fill data
    function fillData(userDailySubmissionsStats) {
      let submissionCount = 0;
      
      userDailySubmissionsStats.forEach(day => {
        const dateStr = day.date;
        const cur = heatmapRef.current.querySelector(`rect.${heatTheme}[data-date="${dateStr}"]`);
        
        if (cur) {
          const value = parseInt(day.count);
          cur.setAttribute('data-count', value);
          
          // Apply color based on submission count
          if (value >= 1 && value < 5) {
            cur.classList.replace('fill-gray-600', 'fill-purple-300');
          } else if (value >= 5 && value < 10) {
            cur.classList.replace('fill-gray-600', 'fill-purple-400');
          } else if (value >= 10 && value < 15) {
            cur.classList.replace('fill-gray-600', 'fill-purple-500');
          } else if (value >= 15 && value < 20) {
            cur.classList.replace('fill-gray-600', 'fill-purple-600');
          } else if (value >= 20) {
            cur.classList.replace('fill-gray-600', 'fill-purple-700');
          }
          
          submissionCount += value;
        }
      });
    }
  };
  
  // Helper functions for heatmap
  function createElementSvg(type, prop) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', type);
    for (const p in prop) {
      e.setAttribute(p, prop[p]);
    }
    return e;
  }
  
  function calculateGap(settings, dayCount) {
    let count = 0;
    let monthCount = null;
    let calculatedDayCount = dayCount;
    
    for (let i = 0; i < 27; i++) {
      const firstDate = new Date(settings.tomorrow);
      firstDate.setDate(settings.tomorrow.getDate() - calculatedDayCount - 1);
      
      const daysLeft = daysInMonth(firstDate) - firstDate.getDate();
      
      for (let j = firstDate.getDay(); j < 7; j++) {
        const rectDate = new Date(settings.tomorrow);
        rectDate.setDate(settings.tomorrow.getDate() - calculatedDayCount);
        
        if (rectDate.getMonth() !== monthCount && i < 52 && j > 3 && daysLeft > 7) {
          monthCount = rectDate.getMonth();
          ++count;
        }
        
        calculatedDayCount--;
      }
    }
    
    return (count > 6) ? 80 : 95;
  }
  
  function daysInMonth(d) {
    return 32 - new Date(d.getFullYear(), d.getMonth(), 32).getDate();
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-purple-900 text-white rounded-lg">
        <div className="text-xl">Loading profile data...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64 bg-purple-900 text-white rounded-lg">
        <div className="text-xl text-red-300">Failed to load profile data</div>
      </div>
    );
  }

  const { profileInfo, analysis, submissionHeatmap, contestGraph } = profileData;

  // Format contest history data for chart
  const chartData = contestGraph.contestHistory.map(contest => ({
    name: contest.contestName.replace('Starters ', 'S').replace(' (Rated)', '').replace(' (rated)', ''),
    rating: parseInt(contest.rating),
    date: contest.date
  }));

  return (
    <div className="max-w-6xl mx-auto p-4 bg-black-900">
      {/* Header Section */}
      <div className="bg-black rounded-lg shadow-lg p-6 mb-6 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

          <div className="flex-1 content-center">
            <div className="mt-3 flex flex-wrap gap-3">
              <div className="bg-purple-700 text-purple-100 px-3 py-1 rounded-full text-sm flex items-center">
                <Trophy size={16} className="mr-1" />
                Rating: {profileInfo.rating}
              </div>
              <div className="bg-purple-700 text-purple-100 px-3 py-1 rounded-full text-sm flex items-center">
                <Activity size={16} className="mr-1" />
                Active Days: {submissionHeatmap.activeDays}
              </div>
              <div className="bg-purple-700 text-purple-100 px-3 py-1 rounded-full text-sm flex items-center">
                <Users size={16} className="mr-1" />
                Best Rank: {contestGraph.bestRank}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="bg-purple-800 rounded-lg shadow-lg overflow-hidden mb-6 text-white">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer bg-purple-700"
          onClick={() => toggleSection('analysis')}
        >
          <h2 className="text-xl font-semibold flex items-center">
            <Award className="mr-2" /> Performance Analysis
          </h2>
          {expandedSections.analysis ? <ChevronUp /> : <ChevronDown />}
        </div>
        
        {expandedSections.analysis && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-200">Activity Stats</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Active Days:</span>
                    <span className="font-medium text-white">{analysis.summary.activeDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Activity Rate:</span>
                    <span className="font-medium text-white">{(parseFloat(analysis.summary.activityRate) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Total Submissions:</span>
                    <span className="font-medium text-white">{submissionHeatmap.totalSubmissions}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-200">Contest Performance</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Contests:</span>
                    <span className="font-medium text-white">{analysis.summary.contestsParticipated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Highest Rating:</span>
                    <span className="font-medium text-white">{analysis.summary.highestRating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Best Rank:</span>
                    <span className="font-medium text-white">{analysis.summary.bestRank}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-200">Progress</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Rating Trend:</span>
                    <span className="font-medium text-green-300 flex items-center">
                      +{analysis.summary.ratingTrend} <TrendingUp size={16} className="ml-1" />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Current Rating:</span>
                    <span className="font-medium text-white">{profileInfo.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium">Recommendations</h3>
              <ul className="mt-2 space-y-2 list-disc pl-5 text-purple-200">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Submission Heatmap Section */}
      <div className="bg-purple-800 rounded-lg shadow-lg overflow-hidden mb-6 text-white">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer bg-purple-700"
          onClick={() => toggleSection('heatmap')}
        >
          <h2 className="text-xl font-semibold flex items-center">
            <Calendar className="mr-2" /> Submission Activity
          </h2>
          {expandedSections.heatmap ? <ChevronUp /> : <ChevronDown />}
        </div>
        
        {expandedSections.heatmap && (
          <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-purple-200 mb-4">
              <div>
                <span className="font-medium text-white">{submissionHeatmap.activeDays}</span> active days, 
                <span className="font-medium ml-1 text-white">{submissionHeatmap.totalSubmissions}</span> total submissions
              </div>
              <div className="flex items-center mt-2 md:mt-0">
                <span className="mr-2">Less</span>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-600 rounded"></div>
                  <div className="w-3 h-3 bg-purple-300 rounded"></div>
                  <div className="w-3 h-3 bg-purple-400 rounded"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <div className="w-3 h-3 bg-purple-600 rounded"></div>
                  <div className="w-3 h-3 bg-purple-700 rounded"></div>
                </div>
                <span className="ml-2">More</span>
              </div>
            </div>
            
            <div className="relative" style={{ minHeight: "200px" }}>
              <div ref={heatmapRef} className="relative w-full overflow-x-auto pb-4"></div>
            </div>
          </div>
        )}
      </div>

      {/* Contest Performance Graph */}
      <div className="bg-purple-800 rounded-lg shadow-lg overflow-hidden mb-6 text-white">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer bg-purple-700"
          onClick={() => toggleSection('contest')}
        >
          <h2 className="text-xl font-semibold flex items-center">
            <Star className="mr-2" /> Contest Performance
          </h2>
          {expandedSections.contest ? <ChevronUp /> : <ChevronDown />}
        </div>
        
        {expandedSections.contest && (
          <div className="p-4">
            <div className="mb-4 flex flex-wrap gap-3">
              <div className="bg-purple-700 text-purple-100 px-3 py-1 rounded-full text-sm">
                Contests: {contestGraph.contestsParticipated}
              </div>
              <div className="bg-purple-700 text-purple-100 px-3 py-1 rounded-full text-sm">
                Highest Rating: {contestGraph.highestRating}
              </div>
              <div className="bg-purple-700 text-purple-100 px-3 py-1 rounded-full text-sm">
                Best Rank: {contestGraph.bestRank}
              </div>
            </div>
            
            <div className="w-full h-64 md:h-80 bg-purple-900 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#8b5cf6" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#e9d5ff' }} 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                    stroke="#e9d5ff"
                  />
                  <YAxis 
                    domain={['dataMin - 100', 'dataMax + 100']} 
                    tick={{ fill: '#e9d5ff' }}
                    stroke="#e9d5ff"
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}`, 'Rating']}
                    labelFormatter={(label, items) => {
                      const item = items[0]?.payload;
                      return `${label} (${item?.date})`;
                    }}
                    contentStyle={{ backgroundColor: '#4c1d95', border: 'none', color: '#e9d5ff' }}
                  />
                  <Legend wrapperStyle={{ color: '#e9d5ff' }} />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#c084fc" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#c084fc' }}
                    activeDot={{ r: 6, fill: '#e9d5ff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Recent Contests Table */}
      <div className="bg-purple-800 rounded-lg shadow-lg overflow-hidden text-white">
        <div className="p-4 bg-purple-700">
          <h2 className="text-xl font-semibold flex items-center">
            <Code className="mr-2" /> Recent Contests
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-purple-800">
            <thead className="bg-purple-700">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Contest</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Rating</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-700">
              {contestGraph.contestHistory.slice(0, 5).map((contest, index) => (
                <tr key={index} className="hover:bg-purple-700">
                  <td className="py-3 px-4 text-sm">{contest.contestName}</td>
                  <td className="py-3 px-4 text-sm text-purple-300">{contest.date}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-600 text-purple-100">
                      {contest.rating}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-purple-300">#{contest.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}