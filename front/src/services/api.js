/**
 * Sends a request to save the flow data
 * @param {object} flowData - The flow data containing nodes and edges
 * @returns {Promise} - A promise resolving to the response data
 */
export const saveFlow = async (flowData) => {
    try {
      console.log(JSON.stringify(flowData))
      const response = await fetch('https://email-scheduler-5lgq.onrender.com/api/setflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flowData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };
  
  /**
   * Retrieves saved flows from the server
   * @returns {Promise} - A promise resolving to the flows data
   */
  export const getFlows = async () => {
    try {
      const response = await fetch('https://email-scheduler-5lgq.onrender.com/api/getflow');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };
  
  /**
   * Retrieves a specific flow by ID
   * @param {string} id - The ID of the flow to retrieve
   * @returns {Promise} - A promise resolving to the flow data
   */
  export const getFlowById = async (id) => {
    try {
      const response = await fetch(`https://email-scheduler-5lgq.onrender.com/flows/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };