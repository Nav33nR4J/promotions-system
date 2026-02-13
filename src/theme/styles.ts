import { StyleSheet } from "react-native";

// Centralized styles using StyleSheet.flatten pattern for reusability
export const styles = StyleSheet.create({
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
    backgroundColor: "#F44336",
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

// Utility to flatten and merge styles
export const flattenStyles = (...stylesArray: any[]) => {
  return StyleSheet.flatten(stylesArray.filter(Boolean));
};

// Common style combinations
export const commonStyles = {
  inputWithLabel: [styles.fieldContainer, styles.label, styles.input],
  cardWithShadow: [styles.card, { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }],
  centerContent: [styles.flex1, styles.rowCenter],
  spaceBetween: [styles.rowBetween, styles.flex1],
};

