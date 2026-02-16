import React, { memo, useCallback } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch } from "react-redux";
import { Text } from "../atoms/Text";
import { ToggleSwitch } from "../molecules/ToggleSwitch";
import {
  Promotion,
  togglePromotionStatus,
  deletePromotion,
} from "../../redux/slices/promotionsSlice";
import { AppDispatch } from "../../redux/store";
import { useTheme } from "../../theme/ThemeProvider";
import {
  componentStyles,
  getPromotionCardThemeStyles,
} from "../../theme/styles";

interface PromotionCardProps {
  promotion: Promotion;
  onEdit: (promotion: Promotion) => void;
}

const PromotionCardComponent: React.FC<PromotionCardProps> = ({
  promotion,
  onEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme, isDark } = useTheme();
  const isActive = promotion.status === "ACTIVE";
  const styles = componentStyles.promotionCard;
  const themedStyles = getPromotionCardThemeStyles(theme, isDark, promotion.status);

  const handleToggle = useCallback(async () => {
    try {
      await dispatch(togglePromotionStatus(promotion.id!)).unwrap();
    } catch {
      Alert.alert("Update Failed", "Unable to update promotion status.");
    }
  }, [dispatch, promotion.id]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Promotion",
      `This action will permanently remove "${promotion.title}".`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deletePromotion(promotion.id!)).unwrap();
            } catch {
              Alert.alert("Deletion Failed", "Unable to delete promotion.");
            }
          },
        },
      ]
    );
  }, [dispatch, promotion.id, promotion.title]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatValue = () => {
    const formatted = new Intl.NumberFormat("en-IN").format(promotion.value);
    return promotion.type === "PERCENTAGE"
      ? `${formatted}%`
      : `₹${formatted}`;
  };

  return (
    <View style={[styles.cardContainer, themedStyles.cardContainer]}>
      <LinearGradient
        colors={themedStyles.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.cardContent}>
          {/* Left Section - Main Info */}
          <View style={styles.leftSection}>
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.promoCodeBadge, themedStyles.promoCodeBadge]}>
                <Text style={[styles.promoCode, themedStyles.promoCode]}>{promotion.promo_code}</Text>
              </View>
              <ToggleSwitch value={isActive} onValueChange={handleToggle} />
            </View>

            <Text style={[styles.title, themedStyles.title]} numberOfLines={1}>
              {promotion.title}
            </Text>

            {/* Discount Value */}
            <View style={styles.discountRow}>
              <Text style={[styles.discountValue, themedStyles.discountValue]}>{formatValue()}</Text>
              <View style={[styles.typeBadge, themedStyles.typeBadge]}>
                <Text style={[styles.typeText, themedStyles.typeText]}>
                  {promotion.type === "PERCENTAGE" ? "%" : "Flat"}
                </Text>
              </View>
            </View>
          </View>

          {/* Vertical Divider */}
          <View style={[styles.verticalDivider, themedStyles.verticalDivider]} />

          {/* Right Section - Dates & Actions */}
          <View style={styles.rightSection}>
            {/* Validity Period */}
            <View style={styles.datesContainer}>
              <View style={styles.dateItem}>
                <Text style={[styles.dateLabel, themedStyles.dateLabel]}>From</Text>
                <Text style={[styles.dateValue, themedStyles.dateValue]}>
                  {formatDate(promotion.start_at)}
                </Text>
              </View>

              <View style={styles.dateItem}>
                <Text style={[styles.dateLabel, themedStyles.dateLabel]}>Until</Text>
                <Text style={[styles.dateValue, themedStyles.dateValue]}>
                  {formatDate(promotion.end_at)}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionSection}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton, themedStyles.editButton]}
                activeOpacity={0.7}
                onPress={() => onEdit(promotion)}
              >
                <Text style={[styles.editButtonText, themedStyles.editButtonText]}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton, themedStyles.deleteButton]}
                activeOpacity={0.7}
                onPress={handleDelete}
              >
                <Text style={[styles.deleteButtonText, themedStyles.deleteButtonText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

// Memoized for optimal performance
export const PromotionCard = memo(
  PromotionCardComponent,
  (prevProps, nextProps) =>
    prevProps.promotion.id === nextProps.promotion.id &&
    prevProps.promotion.status === nextProps.promotion.status &&
    prevProps.promotion.title === nextProps.promotion.title &&
    prevProps.promotion.value === nextProps.promotion.value
);
