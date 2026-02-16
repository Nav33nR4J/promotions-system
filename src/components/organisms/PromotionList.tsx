import React, { useEffect, useCallback, useMemo } from "react";
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { fetchPromotions, Promotion, setFilter } from "../../redux/slices/promotionsSlice";
import { RootState } from "../../redux/store";
import { PromotionCard } from "../molecules/PromotionCard";
import { Text } from "../atoms/Text";
import { useTheme } from "../../theme/ThemeProvider";
import { componentStyles } from "../../theme/styles";

type FilterType = "all" | "active" | "upcoming" | "expired";

interface FilterTabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const FilterTab: React.FC<FilterTabProps> = React.memo(({ label, isActive, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[componentStyles.promotionList.filterTab, isActive && componentStyles.promotionList.filterTabActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isActive ? (
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={componentStyles.promotionList.filterTabGradient}
        >
          <Text style={componentStyles.promotionList.filterTabTextActive}>{label}</Text>
        </LinearGradient>
      ) : (
        <Text style={componentStyles.promotionList.filterTabText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
});

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
    <View style={componentStyles.promotionList.emptyContainer}>
      <Text style={componentStyles.promotionList.emptyIcon}>🎉</Text>
      <Text style={componentStyles.promotionList.emptyTitle}>No Promotions Found</Text>
      <Text style={componentStyles.promotionList.emptySubtitle}>
        {filter === "all" 
          ? "Create your first promotion to get started!"
          : `No ${filter} promotions at the moment`}
      </Text>
    </View>
  ), [filter]);

  return (
    <View style={componentStyles.promotionList.container}>
      {/* Filter Tabs */}
      <View style={componentStyles.promotionList.filterContainer}>
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
          contentContainerStyle={componentStyles.promotionList.filterList}
        />
      </View>

      {/* Promotions List */}
      <FlatList
        data={filteredPromotions}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={componentStyles.promotionList.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

