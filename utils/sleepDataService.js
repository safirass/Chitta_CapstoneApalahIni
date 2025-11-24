import axios from 'axios';

const HC_GATEWAY_API = 'https://api.hcgateway.shuchir.dev';

export const sleepDataService = {
  // Login to HCGateway
  async loginToHCGateway(username, password) {
    try {
      console.log('📡 Attempting HCGateway login with:', username);
      
      const response = await axios.post(
        `${HC_GATEWAY_API}/api/v2/login`,
        {
          username: username,
          password: password
        },
        {
          timeout: 10000
        }
      );
      
      console.log('✅ HCGateway login successful:', response.data);
      
      return {
        token: response.data.token,
        userId: response.data.user_id,
        refreshToken: response.data.refresh,
        expiry: response.data.expiry
      };
    } catch (error) {
      console.error('❌ HCGateway login error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get all sleep data - Uses POST with empty queries
  async getSleepData(token) {
    try {
      console.log('📡 Fetching sleep data with token...');
      
      const response = await axios.post(
        `${HC_GATEWAY_API}/api/v2/fetch/sleepSession`,
        {
          queries: {} // Empty queries to get all sleep data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      
      console.log('✅ Sleep data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching sleep data:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get sleep data for a specific date range
  async getSleepDataByDateRange(token, startDate, endDate) {
    try {
      const response = await axios.post(
        `${HC_GATEWAY_API}/api/v2/fetch/sleepSession`,
        {
          queries: {
            start: { $gte: startDate.toISOString() },
            end: { $lte: endDate.toISOString() }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 10000
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching sleep data by date range:', error.message);
      throw error;
    }
  },

  // Parse sleep duration in hours
  parseSleepDuration(sleepSession) {
    if (!sleepSession || !sleepSession.start || !sleepSession.end) {
      return 0;
    }
    
    const startTime = new Date(sleepSession.start);
    const endTime = new Date(sleepSession.end);
    const durationMs = endTime - startTime;
    const durationHours = durationMs / (1000 * 60 * 60);
    
    return parseFloat(durationHours.toFixed(2));
  },

  // Calculate average sleep
  calculateAverageSleep(sleepDataArray) {
    if (!sleepDataArray || sleepDataArray.length === 0) return 0;
    
    const totalHours = sleepDataArray.reduce((sum, sleep) => {
      return sum + this.parseSleepDuration(sleep);
    }, 0);
    
    return parseFloat((totalHours / sleepDataArray.length).toFixed(2));
  },

  // Format date to readable string
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  },

  // Format time to readable string
  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};