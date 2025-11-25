import axios from 'axios';

const LSTM_API_URL = 'https://lstm-minute-api-1060162947606.asia-southeast2.run.app';

export const lstmService = {
  // Add single data point to buffer
  async addDataPoint(userId, heartRate, respiratoryRate) {
    try {
      const now = new Date();
      const timestamp = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + 'T' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

      const response = await axios.post(
        `${LSTM_API_URL}/buffer/add`,
        {
          user_id: userId,
          data_point: {
            timestamp: timestamp,
            heart_rate: parseFloat(heartRate),
            respiratory_rate: parseFloat(respiratoryRate)
          }
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Error adding data point:', error.response?.data || error.message);
      throw error;
    }
  },

  // Check buffer status
  async getBufferStatus(userId) {
    try {
      const response = await axios.get(
        `${LSTM_API_URL}/buffer/status/${userId}`,
        { timeout: 10000 }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Error getting buffer status:', error.message);
      throw error;
    }
  },

  // Add multiple data points with delay
  async addMultipleDataPoints(userId, hrValues, respValues) {
    try {
      console.log(`📤 Adding ${hrValues.length} data points to buffer...`);

      const now = Date.now();
      let successCount = 0;

      // Add points one by one with delays
      for (let i = 0; i < hrValues.length; i++) {
        // Calculate timestamp - going back in time from now
        const pointTime = new Date(now - (hrValues.length - i - 1) * 1000);
        
        // Format timestamp as YYYY-MM-DDTHH:MM:SS
        const year = pointTime.getFullYear();
        const month = String(pointTime.getMonth() + 1).padStart(2, '0');
        const date = String(pointTime.getDate()).padStart(2, '0');
        const hours = String(pointTime.getHours()).padStart(2, '0');
        const minutes = String(pointTime.getMinutes()).padStart(2, '0');
        const seconds = String(pointTime.getSeconds()).padStart(2, '0');
        const timestamp = `${year}-${month}-${date}T${hours}:${minutes}:${seconds}`;

        try {
          const response = await axios.post(
            `${LSTM_API_URL}/buffer/add`,
            {
              user_id: userId,
              data_point: {
                timestamp: timestamp,
                heart_rate: parseFloat(hrValues[i]),
                respiratory_rate: parseFloat(respValues[i])
              }
            },
            {
              headers: { 'Content-Type': 'application/json' },
              timeout: 10000
            }
          );
          
          successCount++;
          
          // Small delay between requests
          if (i < hrValues.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (err) {
          console.warn(`⚠️ Error adding point ${i + 1}:`, err.response?.status, err.message);
          
          if (err.response?.status === 422) {
            console.error('❌ Invalid data format. Skipping remaining points.');
            break;
          }
        }
      }

      console.log(`✅ Successfully added ${successCount}/${hrValues.length} data points`);

      // Get final buffer status
      const status = await this.getBufferStatus(userId);
      return status;
    } catch (error) {
      console.error('❌ Error adding multiple data points:', error.message);
      throw error;
    }
  },

  // Get prediction - Try multiple endpoints
  async predict(userId) {
    try {
      console.log('🤖 Requesting stress prediction...');

      // Try different prediction endpoints
      const endpoints = [
        { url: `${LSTM_API_URL}/stress/predict/${userId}`, method: 'GET', name: 'GET /stress/predict/{userId}' },
        { url: `${LSTM_API_URL}/predict/stress/${userId}`, method: 'GET', name: 'GET /predict/stress/{userId}' },
        { url: `${LSTM_API_URL}/get_prediction/${userId}`, method: 'GET', name: 'GET /get_prediction/{userId}' },
        { url: `${LSTM_API_URL}/stress`, method: 'POST', name: 'POST /stress', body: { user_id: userId } },
        { url: `${LSTM_API_URL}/predict`, method: 'POST', name: 'POST /predict', body: { user_id: userId } },
      ];

      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`   Trying ${endpoint.name}...`);
          
          let response;
          if (endpoint.method === 'GET') {
            response = await axios.get(endpoint.url, { timeout: 10000 });
          } else {
            response = await axios.post(endpoint.url, endpoint.body, {
              headers: { 'Content-Type': 'application/json' },
              timeout: 10000
            });
          }

          const data = response.data;
          console.log(`✅ Got response from ${endpoint.name}:`, JSON.stringify(data, null, 2));

          // Extract prediction data
          const stressProb = data.stress_probability || 
                            data.stressProbability || 
                            data.prediction_probability ||
                            data.stress_prob ||
                            0;
          
          const confidence = data.confidence || 
                            data.model_confidence ||
                            data.confidence_score ||
                            0;

          const prediction = data.prediction || 
                            data.predicted_label ||
                            data.stress_level ||
                            'Unknown';

          return {
            status: data.status || 'PREDICTED',
            prediction: prediction,
            stress_probability: stressProb,
            confidence: confidence
          };
        } catch (err) {
          lastError = err;
          const statusCode = err.response?.status;
          if (statusCode === 404) {
            console.log(`   ℹ️ Endpoint not found (404)`);
          } else if (statusCode === 405) {
            console.log(`   ℹ️ Method not allowed (405)`);
          } else {
            console.log(`   ⚠️ Request failed:`, err.message);
          }
          // Continue to next endpoint
          continue;
        }
      }

      // If all endpoints failed, throw error
      console.error('❌ All prediction endpoints failed');
      throw lastError || new Error('No prediction endpoint available');

    } catch (error) {
      console.error('❌ Error getting prediction:', error.message);
      throw error;
    }
  }
};