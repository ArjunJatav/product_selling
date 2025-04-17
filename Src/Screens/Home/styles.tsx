import { StyleSheet } from "react-native";
import { grayShade, placeholderColor, seaBlueColor } from "../../Components/Colors";

export const styles = StyleSheet.create({
  homeScreenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  colorfulImage: {
    height: 150,
    width: "100%",
  },
  weedIconImage: {
    height: 120,
    width: 120,
    alignSelf: "center",
    marginTop: -60,
  },
  borderLineView: {
    width: "90%",
    alignSelf: "center",
    height: 2,
    backgroundColor: grayShade,
    marginTop: 15,
  },
  listingText: {
    color: placeholderColor,
    fontSize: 16,
    alignSelf: "center",
    textTransform: "uppercase",
  },
  searchBarContainer: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  browserCategoryContainer: {
    marginTop: 10,
    overflow: "visible",
    marginHorizontal: 10,
  },
  listTextContainer: {
    borderWidth: 1,
    borderColor: placeholderColor,
    marginTop: 10,
    paddingLeft: 10,
    paddingVertical: 15,
    marginHorizontal: 10,
  },
  yourListText: {
    color: "#000",
    fontSize: 22,
    fontWeight: "600",
  },
  keepTrackText: {
    color: placeholderColor,
    fontSize: 18,
  },
  filterContainer: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sortByText: {
    color: placeholderColor,
    fontSize: 15,
  },
  sortTextContainer: {
    flexDirection: "row",
  },
  addOrUnfriendButtonContainer: {
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    borderColor: "#C1C1C1",
  },
  addOrUnfriendButtonText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
  totalListingAndFriendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },
  userAddressContainer: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
  },
  personalInfoContainer: {
    alignSelf: "center",
  },
  userAddressText: {
    color: placeholderColor,
    marginLeft: 5,
  },
  privateAccountIconContainer: {
    height: 80,
    width: 80,
    backgroundColor: seaBlueColor,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  privateAccountContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  accountPrivateTextContainer:{
    marginTop:10,alignItems: 'center',justifyContent: 'center',
  }
});
