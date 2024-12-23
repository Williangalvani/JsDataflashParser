// Browser-compatible version of DataflashParser
(function(global) {
    /* eslint-disable no-unused-vars */
    /* eslint-disable no-var */
    /* eslint-disable no-prototype-builtins */
    const MAV_TYPE_GENERIC = 0 // Generic micro air vehicle.
    // ... existing code ...
    
    // Export to browser global scope
    global.DataflashParser = DataflashParser;
    
})(typeof window !== 'undefined' ? window : this); 