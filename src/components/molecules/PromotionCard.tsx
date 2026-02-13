import React, { memo, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch } from "react-redux";
import { Text } from "../atoms/Text";
import { ToggleSwitch } from "../molecules/ToggleSwitch";
import { Promotion, togglePromotionStatus, deletePromotion } from "../../redux/slices/promotionsSlice";
import { useTheme } from "../../theme/ThemeProvider";
import { getStatusGradient } from "../../theme/colors";

interface PromotionCardProps {
  promotion: Promotion;
  onEdit: (promotion: Promotion) => void;
}

const PromotionCardComponent: React.FC<PromotionCardProps> = ({ promotion, onEdit }) => {
  const dispatch = useDispatch();
  const isActive = promotion.status === "ACTIVE";
  const gradientColors = getStatusGradient(promotion.status);

  const handleToggle = useCallback(async () => {
    try {
      await dispatch(togglePromotionStatus(promotion.id!));
    } catch (error) {
      Alert.alert("Error", "Failed to update promotion status");
    }
  }, [dispatch, promotion.id]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Promotion",
      `Are you sure you want to delete "${promotion.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePromotion(promotion.id!);
            } catch (error) {
              Alert.alert("Error", "Failed to delete promotion");
            }
          },
        },
      ]
    );
  }, [promotion.id, promotion.title]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatValue = () => {
    return promotion.type === "PERCENTAGE"
      ? `${promotion.value}%`
      : `₹${promotion.value}`;
  };

  return (
    <View style={cardStyles.card}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={cardStyles.gradientContainer}
      >
        {/* Header Row */}
        <View style={cardStyles.headerRow}>
          <View style={cardStyles.titleContainer}>
            <Text style={cardStyles.promoCode}>{promotion.promo_code}</Text>
            <Text style={cardStyles.title}>{promotion.title}</Text>
          </View>
          <View style={cardStyles.toggleContainer}>
            <ToggleSwitch value={isActive} onValueChange={handleToggle} />
          </View>
        </View>

        {/* Discount Value */}
        <View style={cardStyles.valueRow}>
          <Text style={cardStyles.discountLabel}>Discount</Text>
          <Text style={cardStyles.discountValue}>{formatValue()}</Text>
          <Text style={cardStyles.discountType}>
            {promotion.type === "PERCENTAGE" ? "OFF" : "FLAT"}
          </Text>
        </View>

        {/* Date Range */}
        <View style={cardStyles.dateRow}>
          <View style={cardStyles.dateItem}>
            <Text style={cardStyles.dateLabel}>Start</Text>
            <Text style={cardStyles.dateValue}>{formatDate(promotion.start_at)}</Text>
          </View>
          <View style={cardStyles.dateDivider} />
          <View style={cardStyles.dateItem}>
            <Text style={cardStyles.dateLabel}>End</Text>
            <Text style={cardStyles.dateValue}>{formatDate(promotion.end_at)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={cardStyles.actionRow}>
          <TouchableOpacity
            style={cardStyles.actionButton}
            onPress={() => onEdit(promotion)}
          >
            <Text style={cardStyles.actionButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[cardStyles.actionButton, cardStyles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={[cardStyles.actionButtonText, cardStyles.deleteButtonText]}>
              🗑️ Delete
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

// Memoized component for performance
export const PromotionCard = memo(PromotionCardComponent, (prevProps, nextProps) => {
  return prevProps.promotion.id === nextProps.promotion.id &&
    prevProps.promotion.status === nextProps.promotion.status &&
    prevProps.promotion.title === nextProps.promotion.title;
});

// Inline styles specific to PromotionCard
const cardStyles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  gradientContainer: {
    padding: 16,
    borderRadius: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  promoCode: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  toggleContainer: {
    marginLeft: 12,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  discountLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginRight: 8,
  },
  discountValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  discountType: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginLeft: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  dateItem: {
    flex: 1,
    alignItems: "center",
  },
  dateDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dateLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  deleteButton: {
    backgroundColor: "rgba(244,67,54,0.2)",
    borderColor: "rgba(244,67,54,0.5)",
  },
  deleteButtonText: {
    color: "#FFCDD2",
  },
});

