import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import Container from "../components/container";
import Card from "../components/card";
import { sleepDataService } from "../utils/sleepDataService";

export default function PelacakanTidurScreen({ navigation, hcGatewayToken }) {
  const [sleepData, setSleepData] = useState({ chart: [] }); // selalu objek supaya UI selalu tampil
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("all"); // filter periode
  const scrollViewRef = useRef(null);

  const fetchSleepData = useCallback(
    async (token, period) => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setError("HCGateway token tidak ditemukan. Silakan login ulang.");
          setSleepData({ chart: [] });
          setSelectedData(null);
          return;
        }

        let raw = [];

        if (period === "all") {
          raw = await sleepDataService.getSleepData(token);
        } else {
          const endDate = new Date();
          const days = period === "7days" ? 7 : 30;
          const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
          raw = await sleepDataService.getSleepDataByDateRange(token, startDate, endDate);
        }

        if (!raw || !Array.isArray(raw) || raw.length === 0) {
          setSleepData({ chart: [] });
          setSelectedData(null);
          // tidak set error — cukup placeholder
          return;
        }

        const mapped = raw
          .map((r) => {
            const start = new Date(r.start);
            const end = new Date(r.end);
            const hours = (end - start) / 1000 / 3600;

            return {
              date: start.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
              }),
              hours,
              start: start.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              end: end.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              __raw: r,
            };
          })
          // sort ascending so newest is at the end (right side)
          .sort((a, b) => {
            const ad = new Date(a.__raw.start || a.start);
            const bd = new Date(b.__raw.start || b.start);
            return ad - bd;
          });

        setSleepData({ chart: mapped });
        setSelectedData(mapped.length > 0 ? mapped[mapped.length - 1] : null);
      } catch (err) {
        console.error("Gagal mengambil data tidur:", err);
        setSleepData({ chart: [] });
        setSelectedData(null);
        setError("Gagal memuat data tidur. Coba lagi nanti.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // load when token or period changes
  useEffect(() => {
    fetchSleepData(hcGatewayToken, selectedPeriod);
  }, [hcGatewayToken, selectedPeriod, fetchSleepData]);

  // scroll to end when there's data
  useEffect(() => {
    const chartLength = sleepData?.chart?.length ?? 0;
    if (chartLength > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }, 200);
    }
  }, [sleepData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSleepData(hcGatewayToken, selectedPeriod);
  }, [hcGatewayToken, selectedPeriod, fetchSleepData]);

  const renderSleepQuality = (duration) => {
    if (duration >= 7.5) return { label: "Sangat Baik", color: "#10b981" };
    if (duration >= 7) return { label: "Baik", color: "#06b6d4" };
    if (duration >= 6) return { label: "Cukup", color: "#f59e0b" };
    return { label: "Kurang", color: "#ef4444" };
  };

  const chartData = sleepData?.chart ?? [];

  const getSleepMessage = (hours) => {
    if (hours == null) return "Belum ada data tidur.";
    if (hours < 6) return "Anda kurang tidur.";
    if (hours <= 8) return "Kualitas tidur baik!";
    return "Anda tidur terlalu lama.";
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>

        {/* Period Filter (baru) */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, selectedPeriod === "all" && styles.filterButtonActive]}
            onPress={() => setSelectedPeriod("all")}
          >
            <Text
              style={[styles.filterButtonText, selectedPeriod === "all" && styles.filterButtonTextActive]}
            >
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, selectedPeriod === "7days" && styles.filterButtonActive]}
            onPress={() => setSelectedPeriod("7days")}
          >
            <Text
              style={[styles.filterButtonText, selectedPeriod === "7days" && styles.filterButtonTextActive]}
            >
              7 Hari
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, selectedPeriod === "30days" && styles.filterButtonActive]}
            onPress={() => setSelectedPeriod("30days")}
          >
            <Text
              style={[styles.filterButtonText, selectedPeriod === "30days" && styles.filterButtonTextActive]}
            >
              30 Hari
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chart Card (tetap seperti tampilan lama) */}
        <Card title="Grafik Pelacakan Tidur" type="info">
          {chartData.length === 0 ? (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderTitle}>Belum ada data tidur</Text>
              <Text style={styles.placeholderSub}>
                Pastikan HCGateway sudah disinkronkan pada perangkat Anda
              </Text>
            </View>
          ) : (
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={[styles.chartScroll, { width: Math.max(chartData.length * 55, 220) }]}
            >
              {chartData.map((item, idx) => (
                <TouchableOpacity key={idx} style={styles.barContainer} onPress={() => setSelectedData(item)}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(6, item.hours * 10),
                        backgroundColor: selectedData?.date === item.date ? "#041062" : "#534DD9",
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{item.date}</Text>
                  <Text style={styles.barHours}>{item.hours.toFixed(1)}j</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </Card>

        <Card title="Durasi Tidur Hari Ini">
          <Text style={styles.duration}>
            {selectedData?.hours != null ? selectedData.hours.toFixed(1) : "--"} jam
          </Text>
          <Text style={styles.subText}>
            {selectedData?.start || "--"} - {selectedData?.end || "--"}
          </Text>
          <Text style={styles.subText}>{getSleepMessage(selectedData?.hours)}</Text>
        </Card>

        <Card title="Tips Tidur">
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation && navigation.navigate && navigation.navigate("Tips Tidur")}
          >
            <Text style={styles.buttonText}>Lihat Tips</Text>
          </TouchableOpacity>
        </Card>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3EFFF",
  },
  content: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3EFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1a1a1a",
  },

  /* filter styles */
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#fff",
  },
  filterButtonActive: {
    backgroundColor: "#6B46C1",
    borderColor: "#6B46C1",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  filterButtonTextActive: {
    color: "#fff",
  },

  /* chart & cards (as before) */
  chartScroll: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  barContainer: { alignItems: "center", marginHorizontal: 6, width: 45 },
  bar: { width: 30, borderRadius: 6 },
  barLabel: { fontSize: 12 },
  barHours: { fontSize: 11 },
  duration: { fontSize: 28, fontWeight: "700", color: "#041062" },
  subText: { fontSize: 14, color: "#555", marginTop: 4 },
  button: {
    marginTop: 12,
    backgroundColor: "#534DD9",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },

  placeholderContainer: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  placeholderTitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    marginBottom: 6,
  },
  placeholderSub: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  /* summary card */
  summaryCard: {
    backgroundColor: "#6B46C1",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  summaryLabel: {
    color: "#fff",
    fontSize: 13,
    marginBottom: 5,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  /* error */
  errorContainer: {
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
  },
});