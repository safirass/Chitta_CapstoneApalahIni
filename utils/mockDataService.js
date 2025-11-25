export const mockDataService = {
  // Generate realistic mock HR data (70-100 BPM) with proper timestamps
  generateMockHeartRateData(count = 128) {
    console.log('🎭 Generating mock heart rate data...');
    const data = [];
    let baseHR = 75;
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const variation = Math.sin(i / 10) * 5 + (Math.random() - 0.5) * 10;
      const hr = Math.round(baseHR + variation);

      // Create timestamp for each second going backwards
      const pointTime = new Date(now.getTime() - (count - i) * 1000);
      
      data.push({
        value: Math.max(60, Math.min(120, hr)),
        timestamp: pointTime.toISOString()
      });
    }

    console.log(`✅ Generated ${count} mock HR records`);
    return data;
  },

  // Generate realistic mock RR data (12-20 breaths/min) with proper timestamps
  generateMockRespiratoryRateData(count = 128) {
    console.log('🎭 Generating mock respiratory rate data...');
    const data = [];
    let baseRR = 16;
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const variation = Math.sin(i / 12) * 2 + (Math.random() - 0.5) * 3;
      const rr = Math.round(baseRR + variation);

      // Create timestamp for each second going backwards
      const pointTime = new Date(now.getTime() - (count - i) * 1000);
      
      data.push({
        value: Math.max(12, Math.min(24, rr)),
        timestamp: pointTime.toISOString()
      });
    }

    console.log(`✅ Generated ${count} mock RR records`);
    return data;
  },

  // Generate either real or mock data
  getTestData(count = 128) {
    const hrData = this.generateMockHeartRateData(count);
    const rrData = this.generateMockRespiratoryRateData(count);
    
    return {
      hr_values: hrData.map(d => d.value).filter(v => !isNaN(v)),
      resp_values: rrData.map(d => d.value).filter(v => !isNaN(v))
    };
  },

  // Generate mock sleep sessions
  generateMockSleepData(days = 7) {
    console.log('🎭 Generating mock sleep data...');
    const data = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const startTime = new Date(date);
      startTime.setHours(23, 0, 0, 0);
      
      const endTime = new Date(date);
      endTime.setDate(endTime.getDate() + 1);
      endTime.setHours(7, 0, 0, 0);

      const variation = (Math.random() - 0.5) * 2;
      const durationHours = 8 + variation;
      endTime.setHours(endTime.getHours() - (8 - durationHours));

      data.push({
        id: `sleep_${i}`,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        duration_ms: (endTime - startTime),
        stages: {
          light: Math.random() * 120,
          deep: Math.random() * 90,
          rem: Math.random() * 60
        }
      });
    }

    console.log(`✅ Generated ${days} mock sleep sessions`);
    return data;
  },

  // Get sleep test data
  getSleepTestData(days = 7) {
    return this.generateMockSleepData(days);
  }
};