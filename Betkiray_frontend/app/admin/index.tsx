// app/(admin)/index.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { useUser } from "@/contexts/UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";
import { router } from "expo-router";

const { width } = Dimensions.get('window');

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export default function AdminDashboardScreen() {
  const { user } = useUser();
  const { colors, isDark } = useTheme();

  const [stats] = useState({
    totalProperties: 248,
    pendingApprovals: 15,
    totalUsers: 1200,
    monthlyEarnings: 5200,
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      {/* Header */}
      <AdminHeader
        headerLeft={
          <View>
            <Text style={[styles.welcomeText, { color: colors.text, fontSize: 24, fontWeight: "700" }]}>
              Welcome, {user?.name?.split(" ")[0] || "Orhan"}!
            </Text>
            <Text style={[styles.subtitleText, { color: colors.muted, fontSize: 14 }]}>Manage the properties</Text>
          </View>
        }
        showAvatar={true}
        userImage={user?.image}
      />

      <View style={{ marginBottom: 20 }} />

      {/* Stats Grid */}
      <View style={styles.gridContainer}>
        {/* Card 1: Total Properties (Green) */}
        <TouchableOpacity onPress={() => router.push("/admin/properties")}>
          <LinearGradient
            colors={isDark ? ['#1f4d25', '#0a1a0d'] : ['#DFEDCA', '#F2F8E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : '#8BC34A' }]}>
                <Ionicons name="business" size={20} color={isDark ? "#fff" : "#fff"} />
              </View>
              <Text style={[styles.percentText, { color: isDark ? '#fff' : '#000' }]}>+12%</Text>
            </View>
            <Text style={[styles.cardValue, { color: isDark ? '#fff' : '#000' }]}>{stats.totalProperties}</Text>
            <Text style={[styles.cardLabel, { color: isDark ? '#aaa' : '#555' }]}>Total Properties</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Card 2: Pending Approvals (Blue) */}
        <TouchableOpacity onPress={() => router.push("/admin/approvals")}>
          <LinearGradient
            colors={isDark ? ['#153866', '#06162E'] : ['#C7DDF4', '#F0F7FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : '#42A5F5' }]}>
                <Ionicons name="time" size={20} color={isDark ? "#fff" : "#fff"} />
              </View>
              <Text style={[styles.percentText, { color: isDark ? '#fff' : '#000' }]}>+5</Text>
            </View>
            <Text style={[styles.cardValue, { color: isDark ? '#fff' : '#000' }]}>{stats.pendingApprovals}</Text>
            <Text style={[styles.cardLabel, { color: isDark ? '#aaa' : '#555' }]}>Pending Approvals</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Card 3: Total Users (Gray) */}
        <TouchableOpacity onPress={() => router.push("/admin/users")}>
          <LinearGradient
            colors={isDark ? ['#333333', '#121212'] : ['#CACACA', '#EFEFEF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : '#212121' }]}>
                <Ionicons name="people" size={20} color={isDark ? "#fff" : "#fff"} />
              </View>
              <Text style={[styles.percentText, { color: isDark ? '#fff' : '#000' }]}>+18%</Text>
            </View>
            <Text style={[styles.cardValue, { color: isDark ? '#fff' : '#000' }]}>{formatNumber(stats.totalUsers)}</Text>
            <Text style={[styles.cardLabel, { color: isDark ? '#aaa' : '#555' }]}>Total Users</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Card 4: Monthly Earnings (Orange) */}
        <TouchableOpacity onPress={() => router.push("/admin/earnings")}>
          <LinearGradient
            colors={isDark ? ['#5a2d12', '#241005'] : ['#F8DBC9', '#F8F2F4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : '#FF9800' }]}>
                <Ionicons name="logo-usd" size={20} color={isDark ? "#fff" : "#fff"} />
              </View>
              <Text style={[styles.percentText, { color: isDark ? '#fff' : '#000' }]}>+8%</Text>
            </View>
            <Text style={[styles.cardValue, { color: isDark ? '#fff' : '#000' }]}>${formatNumber(stats.monthlyEarnings)}</Text>
            <Text style={[styles.cardLabel, { color: isDark ? '#aaa' : '#555' }]}>Monthly Earnings</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Analytics Section */}
      <View style={styles.analyticsSection}>
        <Text style={[styles.analyticsTitle, { color: colors.text }]}>Analytics</Text>

        <View style={[styles.chartCard, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Property Categories</Text>

          <View style={styles.chartContent}>
            <View style={styles.chartContainer}>
              <Image
                source={{
                  uri: `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
                    type: 'doughnut',
                    data: {
                      labels: ['Apartments', 'Houses', 'Office', 'Marketplace'],
                      datasets: [{
                        data: [40, 30, 15, 15],
                        backgroundColor: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
                        borderWidth: 0,
                      }]
                    },
                    options: {
                      cutoutPercentage: 70,
                      legend: { display: false },
                      plugins: {
                        datalabels: { display: false },
                      }
                    }
                  }))}&w=500&h=500`
                }}
                style={styles.chartImage}
                resizeMode="contain"
              />
              <View style={styles.centerLabel}>
                <Text style={[styles.centerLabelText, { color: colors.text }]}>100%</Text>
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4285F4' }]} />
                <Text style={[styles.legendText, { color: colors.muted }]}>Apartments</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#34A853' }]} />
                <Text style={[styles.legendText, { color: colors.muted }]}>Houses</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FBBC05' }]} />
                <Text style={[styles.legendText, { color: colors.muted }]}>Office</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EA4335' }]} />
                <Text style={[styles.legendText, { color: colors.muted }]}>Marketplace</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 0,
  },
  welcomeText: {
    fontSize: 20, // Slightly smaller to fit header if needed, but keeping 22 is fine. Let's revert to basically as is but maybe tighter.
    fontWeight: "800",
  },
  subtitleText: {
    fontSize: 14,
    marginTop: 4,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  card: {
    width: (width - 48 - 16) / 2,
    padding: 20,
    borderRadius: 24,
    height: 180,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  cardValue: {
    fontSize: 34,
    fontWeight: '800',
    color: '#000',
    marginTop: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },

  analyticsSection: {
    marginBottom: 20,
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  chartCard: {
    borderRadius: 24,
    padding: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  chartContent: {
    alignItems: 'center',
    gap: 40,
    width: '100%',
  },
  chartContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chartImage: {
    width: '100%',
    height: '100%',
  },
  centerLabel: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 24,
    fontWeight: '800',
  },

  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
