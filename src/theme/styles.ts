/**
 * Consolidated Styles for Restaurant Management App
 * 
 * All styles are organized by namespace:
 * - shared: Common reusable styles used across components
 * - components: Component-specific styles
 * - app: Page-specific styles
 */

import { StyleSheet } from 'react-native';
import { Theme } from "./colors";

// =============================================================================
// SHARED STYLES - Common reusable styles
// =============================================================================

export const sharedStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    padding: 16,
  },
  screenContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },

  // Card styles
  card: {
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },

  // Field styles
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  labelLarge: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  // Button styles
  buttonContainer: {
    height: 52,
    borderRadius: 12,
    marginVertical: 8,
    overflow: "hidden",
  },
  buttonSmall: {
    height: 40,
    borderRadius: 8,
    marginVertical: 4,
  },
  buttonFullWidth: {
    width: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },

  // Input styles
  input: {
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    fontSize: 16,
  },
  inputLarge: {
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
  },

  // Row styles
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // Text styles
  text: {
    fontSize: 14,
  },
  textSmall: {
    fontSize: 12,
  },
  textLarge: {
    fontSize: 18,
  },
  textBold: {
    fontWeight: "700",
  },
  textCenter: {
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  // Spacing
  spacingXs: { marginVertical: 4 },
  spacingSm: { marginVertical: 8 },
  spacingMd: { marginVertical: 12 },
  spacingLg: { marginVertical: 16 },
  spacingXl: { marginVertical: 24 },
  paddingSm: { padding: 8 },
  paddingMd: { padding: 12 },
  paddingLg: { padding: 16 },

  // Flex utilities
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flexWrap: { flexWrap: "wrap" },

  // Border
  borderRadiusSm: { borderRadius: 6 },
  borderRadiusMd: { borderRadius: 10 },
  borderRadiusLg: { borderRadius: 16 },
  borderRadiusXl: { borderRadius: 24 },
  borderRadiusRound: { borderRadius: 9999 },

  // Icon button
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  // Badge/Status styles
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  badgeActive: {
    backgroundColor: "#4CAF50",
  },
  badgeInactive: {
    backgroundColor: "#9E9E9E",
  },
  badgeUpcoming: {
    backgroundColor: "#2196F3",
  },
  badgeExpired: {
    backgroundColor: "#7C3AED",
  },

  // Toggle/Switch container
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 16,
    minWidth: 280,
    maxWidth: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: "center",
  },
  modalCancel: {
    marginTop: 12,
    paddingVertical: 14,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Date picker button
  dateButton: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },

  // Type selector button
  typeButton: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },

  // Filter tabs
  filterTabsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  filterTabActive: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },

  // List styles
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  // Header styles
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
});

// =============================================================================
// COMPONENT STYLES - Component-specific styles
// =============================================================================

// Using type assertion to allow nested style objects that TypeScript
// would normally reject for StyleSheet.create()
const componentStylesRaw = {
  // --- Button ---
  button: {
    container: {
      height: 52,
      borderRadius: 12,
      marginVertical: 8,
      overflow: "hidden",
    },
    themeToggle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
    },
    createButton: {
      height: 56,
      borderRadius: 16,
      shadowColor: "#7C3AED",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    inner: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  },

  // --- Input ---
  input: {
    container: {
      padding: 12,
      borderRadius: 10,
      marginVertical: 6,
    },
  },

  // --- PromotionCard ---
  promotionCard: {
    cardContainer: {
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
      backgroundColor: "#fff",
    },
    gradient: {
      borderRadius: 14,
      overflow: "hidden",
    },
    cardContent: {
      flexDirection: "row",
      padding: 16,
      minHeight: 130,
    },

    // Left Section
    leftSection: {
      flex: 1.2,
      justifyContent: "space-between",
      paddingRight: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    promoCodeBadge: {
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    promoCode: {
      fontSize: 12,
      fontWeight: "700",
      color: "#fff",
      letterSpacing: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
      marginBottom: 8,
      lineHeight: 22,
    },
    discountRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    discountValue: {
      fontSize: 28,
      fontWeight: "700",
      color: "#fff",
      letterSpacing: -0.5,
    },
    typeBadge: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 5,
    },
    typeText: {
      fontSize: 10,
      fontWeight: "600",
      color: "#fff",
    },

    // Divider
    verticalDivider: {
      width: 1,
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      marginHorizontal: 0,
    },

    // Right Section
    rightSection: {
      flex: 1,
      paddingLeft: 16,
      justifyContent: "space-between",
    },
    datesContainer: {
      gap: 12,
    },
    dateItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dateLabel: {
      fontSize: 11,
      fontWeight: "500",
      color: "rgba(255, 255, 255, 0.7)",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    dateValue: {
      fontSize: 13,
      fontWeight: "600",
      color: "#fff",
    },

    // Action Section
    actionSection: {
      flexDirection: "row",
      gap: 8,
      marginTop: 12,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    editButton: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
    },
    editButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#333",
    },
    deleteButton: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.4)",
    },
    deleteButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#fff",
    },
  },

  // --- PromotionForm ---
  promotionForm: {
    container: { padding: 16 },
    fieldContainer: { marginBottom: 16 },
    label: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
    },
    typeButton: {
      height: 50,
      justifyContent: "center",
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
    },
    typeButtonText: {
      fontSize: 16,
    },
    row: { flexDirection: "row", justifyContent: "space-between" },
    halfField: { flex: 1, marginRight: 8 },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      padding: 20,
      borderRadius: 12,
      minWidth: 280,
      maxHeight: "70%",
    },
    modalScroll: {
      maxHeight: 300,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 16,
      textAlign: "center",
    },
    modalOption: {
      paddingVertical: 14,
      borderBottomWidth: 1,
    },
    modalOptionText: {
      fontSize: 16,
      textAlign: "center",
    },
    modalCancel: {
      marginTop: 12,
      paddingVertical: 14,
    },
    modalCancelText: {
      fontSize: 16,
      fontWeight: "600",
    },
    dateButton: {
      height: 50,
      justifyContent: "center",
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
    },
    dateButtonText: {
      fontSize: 16,
    },
    // Custom type styles
    menuItemRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 8,
      marginBottom: 8,
    },
    menuItemCheckbox: {
      marginRight: 12,
    },
    menuItemInfo: {
      flex: 1,
    },
    menuItemName: {
      fontSize: 14,
      fontWeight: "600",
    },
    menuItemPrice: {
      fontSize: 12,
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 16,
      marginBottom: 8,
    },
    selectedItemContainer: {
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    selectedItemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    selectedItemName: {
      fontSize: 14,
      fontWeight: "600",
    },
    selectedItemDiscount: {
      flexDirection: "row",
      alignItems: "center",
    },
    discountTypeButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      marginRight: 8,
    },
    discountTypeButtonActive: {},
    discountTypeText: {
      fontSize: 12,
    },
    discountInput: {
      flex: 1,
      height: 36,
      borderRadius: 4,
      paddingHorizontal: 8,
    },
    comboContainer: {
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    comboHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    comboItems: {
      fontSize: 12,
      marginBottom: 4,
    },
    comboDiscount: {
      fontSize: 14,
      fontWeight: "600",
    },
    comboRemoveButton: {
      padding: 4,
    },
    comboRemoveText: {
      color: "red",
      fontSize: 14,
    },
    addComboButton: {
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderStyle: "dashed",
      alignItems: "center",
      marginBottom: 16,
    },
    addComboText: {
      fontWeight: "600",
    },
    comboItemRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
    },
    comboItemText: {
      fontSize: 14,
      marginLeft: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 12,
      marginTop: 8,
    },
  },

  // --- PromotionList ---
  promotionList: {
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
  },

  // --- ToggleSwitch ---
  toggleSwitch: {
    container: {
      width: 52,
      height: 30,
      borderRadius: 15,
      padding: 2,
      justifyContent: "center",
    },
    thumb: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 4,
    },
  },
};

// Export componentStyles with proper typing
export const componentStyles = StyleSheet.create(componentStylesRaw as any);

// =============================================================================
// APP STYLES - Page-specific styles
// =============================================================================

const appStylesRaw = {
  // --- HomeScreen ---
  homeScreen: {
    container: {
      flex: 1,
    },
    headerGradient: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: "rgba(255,255,255,0.85)",
    },
    themeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    themeButtonIcon: {
      fontSize: 21,
      lineHeight: 24,
      color: "#FFFFFF",
      fontWeight: "700",
    },
    themeButtonIconStack: {
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    themeIconLayer: {
      position: "absolute",
      textAlign: "center",
    },
    createButtonContainer: {
      position: "absolute",
      bottom: 24,
      left: 20,
      right: 20,
    },
    createButton: {
      backgroundColor: "#7C3AED",
    },
  },

  // --- CreatePromotionScreen ---
  createPromotionScreen: {
    container: {
      flex: 1,
    },
    headerGradient: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 20,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    backButtonText: {
      fontSize: 24,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    placeholder: {
      width: 40,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
  },
};

// Export appStyles with proper typing
export const appStyles = StyleSheet.create(appStylesRaw as any);

export const getPromotionCardThemeStyles = (
  theme: Theme,
  isDark: boolean,
  status?: string
) => {
  const gradientColors =
    status === "ACTIVE"
      ? [theme.gradientStart, theme.gradientEnd]
      : status === "INACTIVE"
      ? [theme.cardAlt, theme.textMuted]
      : [theme.gradientMid, theme.gradientEnd];

  return {
    gradientColors,
    cardContainer: {
      backgroundColor: theme.card,
      shadowColor: isDark ? "#000000" : theme.text,
      borderWidth: 1,
      borderColor: isDark ? theme.border : "transparent",
    },
    promoCodeBadge: {
      borderColor: "rgba(255, 255, 255, 0.35)",
    },
    promoCode: {
      color: "#FFFFFF",
    },
    title: {
      color: "#FFFFFF",
    },
    discountValue: {
      color: "#FFFFFF",
    },
    typeBadge: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    typeText: {
      color: "#FFFFFF",
    },
    verticalDivider: {
      backgroundColor: "rgba(255, 255, 255, 0.25)",
    },
    dateLabel: {
      color: "rgba(255, 255, 255, 0.75)",
    },
    dateValue: {
      color: "#FFFFFF",
    },
    editButtonText: {
      color: theme.primary,
    },
    deleteButton: {
      borderColor: "rgba(255, 255, 255, 0.45)",
    },
    deleteButtonText: {
      color: "#FFFFFF",
    },
  };
};

export const getPromotionFormThemeStyles = (theme: Theme) => {
  return {
    label: {
      color: theme.text,
    },
    typeButton: {
      backgroundColor: theme.card,
      borderColor: theme.text + "30",
    },
    typeButtonText: {
      color: theme.text,
    },
    dateButton: {
      backgroundColor: theme.card,
      borderColor: theme.text + "30",
    },
    dateButtonText: {
      color: theme.text,
    },
    modalContainer: {
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: theme.background,
    },
    modalTitle: {
      color: theme.text,
    },
    modalOption: {
      borderBottomColor: theme.text + "20",
    },
    modalOptionText: {
      color: theme.text,
    },
    modalCancelText: {
      color: theme.primary,
    },
    menuItemRow: {
      backgroundColor: theme.card,
    },
    menuItemName: {
      color: theme.text,
    },
    menuItemPrice: {
      color: theme.text + "80",
    },
    categoryTitle: {
      color: theme.primary,
    },
    selectedItemContainer: {
      backgroundColor: theme.card,
    },
    selectedItemName: {
      color: theme.text,
    },
    discountTypeButton: {
      backgroundColor: theme.text + "10",
    },
    discountTypeButtonActive: {
      backgroundColor: theme.primary,
    },
    discountTypeText: {
      color: theme.text,
    },
    discountInput: {
      backgroundColor: theme.background,
      color: theme.text,
    },
    comboContainer: {
      backgroundColor: theme.card,
    },
    comboItems: {
      color: theme.text + "80",
    },
    comboDiscount: {
      color: theme.primary,
    },
    addComboButton: {
      borderColor: theme.primary,
    },
    addComboText: {
      color: theme.primary,
    },
    comboItemText: {
      color: theme.text,
    },
    sectionTitle: {
      color: theme.text,
    },
  };
};

// =============================================================================
// DEFAULT EXPORT - For easy importing
// =============================================================================

export default {
  ...sharedStyles,
  ...componentStyles,
  ...appStyles,
};
