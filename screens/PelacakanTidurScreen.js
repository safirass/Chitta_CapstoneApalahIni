import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { sleepDataService } from '../utils/sleepDataService';

export default function PelacakanTidurScreen({ hcGatewayToken }) {
  const [sleepData, setSleepData] = useState([]);
  const [averageSleep, setAverageSleep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    if (hcGatewayToken) {
      fetchSleepData();
    } else {
      setError('HCGateway token tidak ditemukan. Silakan login ulang.');
    }
  }, [hcGatewayToken, selectedPeriod]);

  const fetchSleepData = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      
      if (selectedPeriod === 'all') {
        data = await sleepDataService.getSleepData(hcGatewayToken);
      } else if (selectedPeriod === '7days') {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        data = await sleepDataService.getSleepDataByDateRange(hcGatewayToken, startDate, endDate);
      } else if (selectedPeriod === '30days') {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        data = await sleepDataService.getSleepDataByDateRange(hcGatewayToken, startDate, endDate);
      }
      
      if (data && Array.isArray(data) && data.length > 0) {
        const sortedData = data.sort((a, b) => 
          new Date(b.start) - new Date(a.start)
        );
        setSleepData(sortedData);
        
        const avg = sleepDataService.calculateAverageSleep(sortedData);
        setAverageSleep(avg);
      } else {
        setSleepData([]);
        setAverageSleep(0);
        setError('Belum ada data tidur. Pastikan HCGateway sudah disinkronkan.');
      }
    } catch (err) {
      setSleepData([]);
      setError('Gagal memuat data tidur. Coba lagi nanti.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSleepData();
  }, [hcGatewayToken, selectedPeriod]);

  const renderSleepQuality = (duration) => {
    if (duration >= 7.5) return { label: 'Sangat Baik', color: '#10b981' };
    if (duration >= 7) return { label: 'Baik', color: '#06b6d4' };
    if (duration >= 6) return { label: 'Cukup', color: '#f59e0b' };
    return { label: 'Kurang', color: '#ef4444' };
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
        <Text style={{ marginTop: 10 }}>Memuat data tidur...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>Pelacakan Tidur</Text>
        
        {/* Period Filter */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, selectedPeriod === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedPeriod('all')}
          >
            <Text style={[styles.filterButtonText, selectedPeriod === 'all' && styles.filterButtonTextActive]}>Semua</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, selectedPeriod === '7days' && styles.filterButtonActive]}
            onPress={() => setSelectedPeriod('7days')}
          >
            <Text style={[styles.filterButtonText, selectedPeriod === '7days' && styles.filterButtonTextActive]}>7 Hari</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, selectedPeriod === '30days' && styles.filterButtonActive]}
            onPress={() => setSelectedPeriod('30days')}
          >
            <Text style={[styles.filterButtonText, selectedPeriod === '30days' && styles.filterButtonTextActive]}>30 Hari</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        {sleepData.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Rata-rata Tidur</Text>
              <Text style={styles.summaryValue}>{averageSleep} jam</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Hari</Text>
              <Text style={styles.summaryValue}>{sleepData.length}</Text>
            </View>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {sleepData && sleepData.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Riwayat Tidur</Text>
            {sleepData.map((sleep, index) => {
              const duration = sleepDataService.parseSleepDuration(sleep);
              const quality = renderSleepQuality(duration);
              
              return (
                <View key={index} style={styles.sleepCard}>
                  <View style={styles.sleepHeader}>
                    <View style={styles.sleepHeaderLeft}>
                      <Text style={styles.sleepDate}>
                        {sleepDataService.formatDate(sleep.start)}
                      </Text>
                      <View style={[styles.qualityBadge, { backgroundColor: quality.color }]}>
                        <Text style={styles.qualityText}>{quality.label}</Text>
                      </View>
                    </View>
                    <Text style={[styles.sleepDuration, { color: quality.color }]}>
                      {duration} jam
                    </Text>
                  </View>
                  <View style={styles.sleepTimes}>
                    <Text style={styles.sleepTime}>
                      🌙 Tidur: {sleepDataService.formatTime(sleep.start)}
                    </Text>
                    <Text style={styles.sleepTime}>
                      ☀️ Bangun: {sleepDataService.formatTime(sleep.end)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada data tidur tersedia</Text>
            <Text style={styles.emptySubtext}>
              Pastikan HCGateway sudah disinkronkan di perangkat Anda
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EFFF'
  },
  content: {
    padding: 20
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3EFFF'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a1a1a'
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  filterButtonActive: {
    backgroundColor: '#6B46C1',
    borderColor: '#6B46C1'
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666'
  },
  filterButtonTextActive: {
    color: '#fff'
  },
  summaryCard: {
    backgroundColor: '#6B46C1',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)'
  },
  summaryLabel: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 5
  },
  summaryValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a'
  },
  sleepCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6B46C1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  sleepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sleepHeaderLeft: {
    flex: 1,
    gap: 8
  },
  sleepDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a'
  },
  qualityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  qualityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600'
  },
  sleepDuration: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  sleepTimes: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10
  },
  sleepTime: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 13,
    color: '#bbb',
    textAlign: 'center'
  }
});