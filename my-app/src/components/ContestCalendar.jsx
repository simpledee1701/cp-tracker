const ContestCalendar = ({ contests }) => {
    // This is a simplified calendar view
    // For a full calendar implementation, consider using a library like react-calendar
    
    return (
      <div className="bg-white rounded-lg shadow-md p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contest Calendar</h3>
        
        <div className="text-center py-8">
          <p className="text-gray-500">Calendar view would go here</p>
          <p className="text-sm text-gray-400 mt-2">
            Integrate with a calendar library to show contest dates
          </p>
        </div>
      </div>
    );
  };
  
  export default ContestCalendar;