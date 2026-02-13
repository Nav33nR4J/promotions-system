import React, { useEffect, useCallback, useMemo } from "react";
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { fetchPromotions, Promotion, setFilter } from "../../redux/slices/promotionsSlice";
import { RootState } from "../../redux/store";
import { PromotionCard } from "../molecules/PromotionCard";
import { Text } from "../atoms/Text";
import { useTheme } from "../../theme/ThemeProvider";

type FilterType = "all" | "active" | "upcoming" | "expired";

interface FilterTabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const FilterTab: React.FC<FilterTabProps> = React.memo(({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.filterTab, isActive && styles.filterTabActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {isActive ? (
      <LinearGradient
        colors={["#FF6B6B", "#FF3B30"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.filterTabGradient}
      >
        <Text style={styles.filterTabTextActive}>{label}</Text>
      </LinearGradient>
    ) : (
      <Text style={styles.filterTabText}>{label}</Text>
    )}
  </TouchableOpacity>
));

interface PromotionListProps {
  onEditPromotion: (promotion: Promotion) => void;
}

export const PromotionList: React.FC<PromotionListProps> = ({ onEditPromotion }) => {
  const dispatch = useDispatch<any>();
  const { promotions, loading, filter } = useSelector((state: RootState) => state.promotions);
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(fetchPromotions(filter === "all" ? undefined : filter));
  }, [dispatch, filter]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchPromotions(filter === "all" ? undefined : filter));
  }, [dispatch, filter]);

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    dispatch(setFilter(newFilter));
  }, [dispatch]);

  const filteredPromotions = useMemo(() => {
    if (filter === "all") return promotions;
    return promotions;
  }, [promotions, filter]);

  const renderItem = useCallback(({ item }: { item: Promotion }) => (
    <PromotionCard promotion={item} onEdit={onEditPromotion} />
  ), [onEditPromotion]);

  const keyExtractor = useCallback((item: Promotion) => String(item.id), []);

  const ListEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎉</Text>
      <Text style={styles.emptyTitle}>No Promotions Found</Text>
      <Text style={styles.emptySubtitle}>
        {filter === "all" 
          ? "Create your first promotion to get started!"
          : `No ${filter} promotions at the moment`}
      </Text>
    </View>
  ), [filter]);

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "upcoming", label: "Upcoming" },
            { key: "expired", label: "Expired" },
          ] as { key: FilterType; label: string }[]}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <FilterTab
              label={item.label}
              isActive={filter === item.key}
              onPress={() => handleFilterChange(item.key)}
            />
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Promotions List */}
      <FlatList
        data={filteredPromotions}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={["#FF3B30"]}
            tintColor="#FF3B30"
          />
        }
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingVertical: 12,
  },
  filterList: {
    paddingHorizontal: 16,
  },
  filterTab: {
    marginRight: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  filterTabActive: {
    borderRadius: 20,
  },
  filterTabGradient: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterTabText: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  filterTabTextActive: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

