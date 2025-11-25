import { sleepDataService } from './sleepDataService';
import { lstmService } from './lstmService';
import { mockDataService } from './mockDataService';

function defaultMockData(len = 128) {
  const hr = new Array(len).fill(0).map(() => 60 + Math.round(Math.random() * 40));
  const rr = new Array(len).fill(0).map(() => 12 + Math.round(Math.random() * 8));
  return {
    hr_values: hr,
    resp_values: rr,
  };
}

export const hourlyPredictionService = {
  predictionInterval: null,
  isRunning: false,
  lastPredictionTime: null,
  useMockData: true,
  dataMode: 'mock',
  allPredictions: [], // Store all predictions

  async startHourlyPredictions(hcGatewayToken, userId) {
    try {
      if (this.isRunning) {
        console.log('⚠️ Hourly predictions already running');
        return;
      }

      console.log('⏰ Starting hourly predictions (synced with HCGateway 2-hour cycle)...');
      this.isRunning = true;

      // Run immediately on login
      console.log('🚀 Running first prediction immediately...');
      await this.runPredictionOnce(hcGatewayToken, userId);

      // Then every 1 HOUR
      this.predictionInterval = setInterval(
        () => this.runPredictionOnce(hcGatewayToken, userId),
        60 * 60 * 1000 // 1 hour in milliseconds
      );

      console.log('✅ Predictions will run every 1 hour');
    } catch (error) {
      console.error('❌ Failed to start:', error && error.message ? error.message : error);
    }
  },

  async runPredictionOnce(hcGatewayToken, userId) {
    try {
      const timestamp = new Date().toLocaleTimeString('id-ID');
      console.log('\n' + '='.repeat(60));
      console.log(`⏰ PREDICTION RUN - ${timestamp}`);
      console.log('='.repeat(60));

      const startTime = Date.now();

      // Step 1: Try to fetch real data
      console.log('\n📊 Step 1: Fetching vital signs...');

      let vitalSigns = null;
      let dataSource = 'Unknown';

      try {
        console.log('📡 Trying real data from HCGateway...');

        if (!sleepDataService || typeof sleepDataService.getVitalSignsForLSTM !== 'function') {
          throw new Error("sleepDataService is not available or missing getVitalSignsForLSTM()");
        }

        const realData = await sleepDataService.getVitalSignsForLSTM(hcGatewayToken);

        if (
          realData &&
          Array.isArray(realData.hr_values) &&
          Array.isArray(realData.resp_values) &&
          realData.hr_values.length > 0 &&
          realData.resp_values.length > 0
        ) {
          vitalSigns = realData;
          dataSource = 'HCGateway 📡';
          console.log(`✅ Got real data from HCGateway: ${realData.hr_values.length} HR + ${realData.resp_values.length} RR`);
        } else {
          const hrCount = realData && Array.isArray(realData.hr_values) ? realData.hr_values.length : 0;
          const rrCount = realData && Array.isArray(realData.resp_values) ? realData.resp_values.length : 0;
          throw new Error(`Incomplete data - HR: ${hrCount}, RR: ${rrCount}`);
        }
      } catch (error) {
        console.warn('⚠ HCGateway data incomplete or failed:', error && error.message ? error.message : error);
        console.warn('⚠ Using mock data instead...');

        if (mockDataService && typeof mockDataService.getTestData === 'function') {
          try {
            vitalSigns = await mockDataService.getTestData(128);
          } catch (e) {
            console.warn('⚠ mockDataService.getTestData failed, falling back to default mock data:', e && e.message ? e.message : e);
            vitalSigns = defaultMockData(128);
          }
        } else {
          vitalSigns = defaultMockData(128);
        }
        dataSource = 'Mock Data 🎭';
      }

      if (
        !vitalSigns ||
        !Array.isArray(vitalSigns.hr_values) ||
        !Array.isArray(vitalSigns.resp_values) ||
        vitalSigns.hr_values.length === 0 ||
        vitalSigns.resp_values.length === 0
      ) {
        console.error('❌ No valid vital signs available');
        return {
          success: false,
          message: 'No valid data available'
        };
      }

      // Ensure both arrays have the same length
      const minLength = Math.min(vitalSigns.hr_values.length, vitalSigns.resp_values.length);
      const hrValues = vitalSigns.hr_values.slice(0, minLength);
      const rrValues = vitalSigns.resp_values.slice(0, minLength);

      console.log(`✅ Fetched ${hrValues.length} HR and ${rrValues.length} RR values`);
      console.log(`   Data source: ${dataSource}`);

      // Step 2: Add data points to buffer
      console.log('\n📤 Step 2: Adding data points to LSTM buffer...');

      let bufferStatus = {
        buffer_size: 0,
        progress_percentage: 0,
        ready_to_predict: false,
        message: 'No LSTM service'
      };

      if (lstmService && typeof lstmService.addMultipleDataPoints === 'function') {
        try {
          const maybeBuffer = await lstmService.addMultipleDataPoints(userId, hrValues, rrValues);
          if (maybeBuffer && typeof maybeBuffer === 'object') {
            bufferStatus = maybeBuffer;
          }
        } catch (e) {
          console.warn('⚠ lstmService.addMultipleDataPoints failed:', e && e.message ? e.message : e);
        }
      } else {
        console.warn('⚠ lstmService not available - using mock buffer status');
        bufferStatus = {
          buffer_size: hrValues.length,
          progress_percentage: Math.min(100, Math.round((hrValues.length / 128) * 100)),
          ready_to_predict: hrValues.length >= 128,
          message: 'Mock buffer status'
        };
      }

      console.log('📊 Buffer status after adding data:');
      console.log(`   Size: ${bufferStatus.buffer_size}`);
      console.log(`   Progress: ${bufferStatus.progress_percentage}%`);
      console.log(`   Ready: ${bufferStatus.ready_to_predict}`);
      console.log(`   Message: ${bufferStatus.message}`);

      // Step 3: Try to get prediction if buffer is ready
      let prediction = null;
      if (bufferStatus.ready_to_predict) {
        console.log('\n🤖 Step 3: Buffer ready! Getting prediction...');

        // Wait a moment to ensure buffer is fully ready
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (lstmService && typeof lstmService.predict === 'function') {
          try {
            prediction = await lstmService.predict(userId);
          } catch (predError) {
            console.warn('⚠ Error getting prediction:', predError && predError.message ? predError.message : predError);
          }
        } else {
          console.warn('⚠ lstmService.predict not available - will use mock prediction');
        }

        if (!prediction) {
          console.warn('💡 Using mock prediction for UI display...');
          prediction = {
            status: 'PREDICTED_MOCK',
            prediction: Math.random() > 0.5 ? 'Stressed' : 'Relaxed',
            stress_probability: Math.random() * 0.8 + 0.1,
            confidence: Math.random() * 0.9 + 0.1
          };
        } else {
          console.log('\n✅ PREDICTION RESULT');
          console.log(`   Status: ${prediction.status}`);
          console.log(`   Prediction: ${prediction.prediction}`);
          console.log(`   Probability: ${(prediction.stress_probability * 100).toFixed(1)}%`);
          console.log(`   Confidence: ${(prediction.confidence * 100).toFixed(1)}%`);
          console.log(`   Data from: ${dataSource}`);
        }
      } else {
        console.log('\n⏳ Buffer not yet full');
        console.log(`   ${bufferStatus.message}`);
      }

      // Step 4: Store prediction if we have one
      // (modifikasi bagian yang membuat dateKey saat menyimpan prediksi)

      if (prediction) {
        const now = new Date();
        const dateKey = now.toISOString().split('T')[0];
        const timeKey = now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        });

        const predictionRecord = {
          time: timeKey,
          stressProbability: (prediction.stress_probability || 0) * 100,
          confidence: (prediction.confidence || 0) * 100,
          prediction: prediction.prediction,
          dataSource: dataSource,
          timestamp: now.toISOString()
        };

        // Add to existing date or create new
        const existingDateIndex = this.allPredictions.findIndex((d) => d.date === dateKey);
        if (existingDateIndex >= 0) {
          this.allPredictions[existingDateIndex].hourly.push(predictionRecord);
        } else {
          this.allPredictions.push({
            date: dateKey,
            hourly: [predictionRecord],
          });
        }

        console.log('💾 Prediction stored:', predictionRecord);
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n⏱  Completed in ${duration}s`);
      console.log('='.repeat(60) + '\n');

      this.lastPredictionTime = new Date();
      this.dataMode = dataSource;

      return {
        success: prediction !== null,
        prediction: prediction,
        bufferStatus: bufferStatus,
        duration: duration,
        dataSource: dataSource
      };
    } catch (error) {
      console.error('❌ Prediction error:', error && error.message ? error.message : error);
      console.log('='.repeat(60) + '\n');
      return {
        success: false,
        error: error && error.message ? error.message : error
      };
    }
  },

  stop() {
    if (this.predictionInterval) {
      clearInterval(this.predictionInterval);
      this.predictionInterval = null;
      this.isRunning = false;
      console.log('⏹ Predictions stopped');
    } else {
      console.log('⚠ Predictions are not running');
    }
  },

  // Get all predictions
  getAllPredictions() {
    return this.allPredictions;
  },

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastPredictionTime: this.lastPredictionTime,
      nextPredictionIn: this.isRunning ? '~1 hour' : 'Not running',
      dataMode: this.dataMode
    };
  }
}; 