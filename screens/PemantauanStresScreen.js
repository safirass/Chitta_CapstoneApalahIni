import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import Container from "../components/container";
import Card from "../components/card";
import { hourlyPredictionService } from "../utils/hourlyPredictionService";

// Helper: convert/normalize any input date into service dateKey format: dd/mm/yyyy (id-ID)
const toServiceDateKey = (input) => {
  if (!input && input !== 0) return null;

  // If it's already an id-ID string dd/mm/yyyy
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return trimmed;

    // If already ISO YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [yyyy, mm, dd] = trimmed.split("-");
      return `${dd}/${mm}/${yyyy}`;
    }

    // Try Date.parse fallback
    const parsed = Date.parse(trimmed);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      return d.toLocaleDateString("id-ID");
    }

    const asNum = Number(trimmed);
    if (!isNaN(asNum)) {
      const d = new Date(asNum);
      if (!isNaN(d.getTime())) return d.toLocaleDateString("id-ID");
    }

    return null;
  }

  if (typeof input === "number") {
    const d = new Date(input);
    if (!isNaN(d.getTime())) return d.toLocaleDateString("id-ID");
    return null;
  }

  if (input instanceof Date) {
    if (!isNaN(input.getTime())) return input.toLocaleDateString("id-ID");
    return null;
  }

  return null;
};

// parse service dateKey dd/mm/yyyy -> Date object (local)
const parseServiceDateKey = (dateKey) => {
  if (!dateKey || typeof dateKey !== "string") return null;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateKey)) {
    const [dd, mm, yyyy] = dateKey.split("/");
    // month index is zero-based
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (!isNaN(d.getTime())) return d;
  }
  // fallback to Date.parse
  const parsed = Date.parse(dateKey);
  if (!isNaN(parsed)) return new Date(parsed);
  return null;
};

export default function PemantauanStresScreen({ hcGatewayToken, userData, navigation }) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  // default selected date = hari ini in service format dd/mm/yyyy
  const todayServiceKey = new Date().toLocaleDateString("id-ID");
  const [selectedDateKey, setSelectedDateKey] = useState(todayServiceKey);
  const [selectedData, setSelectedData] = useState(null);

  const [lastPredictionTime, setLastPredictionTime] = useState(null);
  const [nextPredictionTime, setNextPredictionTime] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    let checkInterval = null;
    let statusInterval = null;

    const startService = async () => {
      try {
        setLoading(true);

        const userId = userData?.id || userData?.nama || "user";

        const existingRaw = hourlyPredictionService.getAllPredictions?.() || [];
        // Normalize predictions' date into service dateKey (dd/mm/yyyy)
        const existing = existingRaw
          .map((p) => ({ ...p, dateKey: toServiceDateKey(p.date) }))
          .filter((p) => p.dateKey); // drop invalid dates

        if (existing.length > 0) {
          setPredictions(existing);
        }

        hourlyPredictionService.startHourlyPredictions(hcGatewayToken, userId);

        // Poll predictions frequently and replace state with normalized items
        checkInterval = setInterval(() => {
          try {
            const allRaw = hourlyPredictionService.getAllPredictions?.() || [];
            const all = allRaw
              .map((p) => ({ ...p, dateKey: toServiceDateKey(p.date) }))
              .filter((p) => p.dateKey);
            setPredictions(all);
            setLoading(false);
            const status = hourlyPredictionService.getStatus();
            setLastPredictionTime(status.lastPredictionTime);
          } catch (e) {
            console.warn("Error polling predictions", e);
          }
        }, 3000);

        statusInterval = setInterval(() => {
          const status = hourlyPredictionService.getStatus();
          if (status.isRunning && status.lastPredictionTime) {
            const lastTime = new Date(status.lastPredictionTime);
            if (!isNaN(lastTime.getTime())) {
              setNextPredictionTime(new Date(lastTime.getTime() + 60 * 60 * 1000));
            }
          }
        }, 60000);

        const statusNow = hourlyPredictionService.getStatus();
        setLastPredictionTime(statusNow.lastPredictionTime);
        if (statusNow.isRunning && statusNow.lastPredictionTime) {
          const lastTime = new Date(statusNow.lastPredictionTime);
          if (!isNaN(lastTime.getTime())) {
            setNextPredictionTime(new Date(lastTime.getTime() + 60 * 60 * 1000));
          }
        }
      } catch (e) {
        console.warn("Gagal start service", e);
        setLoading(false);
      }
    };

    startService();

    return () => {
      try { hourlyPredictionService.stop(); } catch (e) {}
      if (checkInterval) clearInterval(checkInterval);
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [hcGatewayToken, userData]);

  useEffect(() => {
    if (!selectedDateKey) {
      setSelectedData(null);
      return;
    }
    const found = predictions.find((p) => p.dateKey === selectedDateKey) || null;
    setSelectedData(found);
  }, [predictions, selectedDateKey]);

  // produce daily pills for the last N days (default 365) in service format dd/mm/yyyy
  const DAYS_BACK = 365;
  const datePills = useMemo(() => {
    const list = [];
    const base = new Date(); // local
    for (let i = 0; i < DAYS_BACK; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      list.push(d.toLocaleDateString("id-ID"));
    }
    return list; // descending from today -> past
  }, []);

  const formatLabel = (serviceDateKey) => {
    if (!serviceDateKey) return "";
    const dt = parseServiceDateKey(serviceDateKey);
    if (!dt) return serviceDateKey;
    return dt.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  };

  const formatYear = (serviceDateKey) => {
    if (!serviceDateKey) return "";
    const dt = parseServiceDateKey(serviceDateKey);
    if (!dt) return "";
    return dt.getFullYear();
  };

  const formatFull = (serviceDateKey) => {
    if (!serviceDateKey) return "";
    const dt = parseServiceDateKey(serviceDateKey);
    if (!dt) return serviceDateKey;
    return dt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getStressColor = (prob) => {
    if (prob < 25) return "#2ECC71";
    if (prob < 50) return "#F39C12";
    if (prob < 75) return "#E67E22";
    return "#E74C3C";
  };

  const getStressLabel = (prob) => {
    if (prob < 25) return "Rendah";
    if (prob < 50) return "Sedang";
    if (prob < 75) return "Tinggi";
    return "Sangat Tinggi";
  };

  const getStressAdvice = (prob) => {
    if (prob < 25) return "Kondisimu baik! Pertahankan rutinitas positif.";
    if (prob < 50) return "Stres sedang. Cobalah relaksasi atau istirahat.";
    if (prob < 75) return "Stres tinggi. Gunakan teknik pernapasan dan pertimbangkan konsultasi.";
    return "Stres sangat tinggi. Segera hubungi konselor profesional.";
  };

  const statusText = () => {
    if (!hourlyPredictionService.isRunning) return "Tidak berjalan";
    if (!lastPredictionTime) return "Menunggu prediksi pertama...";
    const t = new Date(lastPredictionTime);
    return `Terakhir: ${t.toLocaleTimeString("id-ID")}`;
  };

  // scroll active pill into view ketika selectedDateKey berubah
  useEffect(() => {
    const idx = datePills.findIndex((d) => d === selectedDateKey);
    if (idx >= 0 && scrollRef.current) {
      const pillWidth = 86 + 8; // width + marginRight (synchronized with styles)
      const x = Math.max(0, idx * pillWidth - 20);
      try {
        scrollRef.current.scrollTo({ x, animated: true });
      } catch (e) {
        // ignore
      }
    }
  }, [selectedDateKey, datePills]);

  return (
    <Container>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.datePillsOuter}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datePillsInner}
            ref={scrollRef}
          >
            {datePills.map((d) => {
              const isActive = d === selectedDateKey;
              const dataForDay = predictions.find((p) => p.dateKey === d);
              return (
                <TouchableOpacity
                  key={d}
                  style={[styles.pill, isActive ? styles.pillActive : null, !dataForDay ? styles.pillNoData : null]}
                  onPress={() => setSelectedDateKey(d)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, isActive ? styles.pillTextActive : null]}>
                    {formatLabel(d)}
                  </Text>
                  <Text style={[styles.pillSmallYear, isActive ? styles.pillTextActive : null]}>
                    {formatYear(d)}
                  </Text>
                  <View style={[styles.dataDot, dataForDay ? styles.dataDotVisible : styles.dataDotHidden]} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* GRAPH CARD - tetap pakai Card component */}
        <Card type="info">
          <View>
            <Text style ={styles.graphTitle}>
              Riwayat Stres ({selectedDateKey ? formatFull(selectedDateKey) : "—"})
            </Text>

            {/* STATUS DI DALAM CARD */}
            {hourlyPredictionService.isRunning && (
              <View style={{ alignItems: "center", marginBottom: 10 }}>
                <Text style={{ color: "#666", fontSize: 12 }}>{statusText()}</Text>

                {nextPredictionTime && (
                  <Text style={{ color: "#aaa", fontSize: 11 }}>
                    Next: {nextPredictionTime.toLocaleTimeString("id-ID")}
                  </Text>
                )}
              </View>
            )}

            {selectedData && selectedData.hourly?.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.barRow}>
                {selectedData.hourly.map((item, idx) => {
                  const probability = item.stressProbability ?? (item.stressed ? 90 : 10);
                  const barHeight = (probability / 100) * 140;
                  const color = getStressColor(probability);
                  return (
                    <View key={idx} style={styles.barContainer}>
                      <Text style={styles.smallLabel}>{getStressLabel(probability)}</Text>

                      <View style={styles.graphBarWrapper}>
                        <View style={[styles.graphBar, { height: barHeight, backgroundColor: color }]} />
                      </View>

                      <Text style={styles.timeLabel}>{item.time ?? item.hour}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>Belum ada riwayat pemantauan stress</Text>
                <Text style={styles.noDataSub}>Pilih tanggal untuk melihat riwayat harian.</Text>
              </View>
            )}
          </View>
        </Card>

        {/* DETAIL */}
        <Card>
          {selectedData && selectedData.hourly && selectedData.hourly.length > 0 ? (
            selectedData.hourly.map((item, idx) => (
              <View key={idx} style={styles.detailItem}>
                <Text style={styles.detailText}>
                  {item.time ?? item.hour}: {item.prediction ?? (item.stressed ? "Stres" : "Relax")} - {getStressAdvice(item.stressProbability ?? (item.stressed ? 90 : 10))}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.detailEmpty}>
              <Text style={styles.detailEmptyText}>Belum ada riwayat pada tanggal ini.</Text>
            </View>
          )}
        </Card>

        {/* ACTIONS */}
        <Card>
          <TouchableOpacity onPress={() => navigation?.navigate?.("Kesadaran Penuh")}>
            <Text style={styles.actionTitle}>Kesadaran Penuh &gt;</Text>
            <Text style={styles.actionSub}>Ruang untuk kamu fokus, menulis jurnal, dan merasakan ketenangan.</Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <TouchableOpacity onPress={() => navigation?.navigate?.("Tips Stres")}>
            <Text style={styles.actionTitle}>Tips Mengatasi Stres &gt;</Text>
            <Text style={styles.actionSub}>Dapatkan tips dan saran untuk mengelola stres dengan lebih baik.</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#efe9fb",
    flex: 1,
  },
  graphTitle: {
    textAlign: "center",
    fontSize: 18,
    color: "#24307a",
    fontWeight: "700",
    marginBottom: 8,
  },

  /* DATE PILLS */
  datePillsOuter: {
    marginTop: 0,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  datePillsInner: {
    paddingVertical: 8,
    alignItems: "center",
    paddingLeft: 8,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F3EEFF",
    marginRight: 8,
    width: 86,
    alignItems: "center",
    justifyContent: "center",
  },
  pillNoData: {
    // visually lighter for no-data days
    backgroundColor: "#F8F7FB",
  },
  pillActive: {
    backgroundColor: "#534DD9",
  },
  pillText: {
    color: "#3a2f6b",
    fontWeight: "700",
    fontSize: 13,
  },
  pillSmallYear: {
    color: "#3a2f6b",
    fontSize: 11,
    marginTop: 2,
  },
  pillTextActive: {
    color: "#fff",
  },

  /* small dot to indicate there is data for that day */
  dataDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  dataDotVisible: {
    backgroundColor: "#8A6CFF",
    opacity: 1,
  },
  dataDotHidden: {
    backgroundColor: "#8A6CFF",
    opacity: 0.12,
  },

  /* PICKER (kept some styles if needed) */
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d7d7d7",
  },
  pickerLabel: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f5f5f5",
    borderRightWidth: 1,
    borderRightColor: "#e6e6e6",
  },
  pickerLabelText: {
    color: "#333",
    fontSize: 13,
  },
  pickerBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerBoxText: {
    color: "#333",
    fontSize: 13,
    fontWeight: "600",
  },

  dateSelectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6e0ff",
  },
  dateSelectText: {
    color: "#534DD9",
    fontWeight: "600",
    fontSize: 13,
  },

  /* GRAPH */
  graphCard: {
    minHeight: 160,
    paddingVertical: 12,
    paddingHorizontal: 12,
    position: "relative",
  },
  graphLeftStripe: {
    position: "absolute",
    left: -8,
    top: 12,
    bottom: 12,
    width: 12,
    backgroundColor: "#534DD9",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  graphTitle: {
    textAlign: "center",
    fontSize: 18,
    color: "#24307a",
    fontWeight: "700",
    marginBottom: 8,
  },

  barRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 8,
    gap: 16,
  },
  barContainer: {
    alignItems: "center",
    width: 80,
  },
  smallLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  graphBarWrapper: {
    width: 48,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  graphBar: {
    width: "78%",
    borderRadius: 8,
  },
  timeLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#3a2f6b",
    fontWeight: "700",
  },

  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
  },
  noDataText: {
    fontSize: 16,
    color: "#3a2f6b",
    fontWeight: "700",
    marginBottom: 6,
  },
  noDataSub: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },

  /* DETAIL */
  detailItem: {
    paddingVertical: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#4d4d4d",
    lineHeight: 22,
  },
  detailEmpty: {
    paddingVertical: 12,
  },
  detailEmptyText: {
    color: "#666",
  },

  /* ACTION */
  actionTitle: {
    fontSize: 16,
    color: "#24307a",
    fontWeight: "800",
    marginBottom: 6,
  },
  actionSub: {
    fontSize: 13,
    color: "#666",
  },
});