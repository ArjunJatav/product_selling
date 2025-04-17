import { StyleSheet } from "react-native";
import {
  placeholderColor,
  redColor,
  textColor,
  whiteButtonTextColor,
} from "../../Components/Colors";

export const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titleContainer: {
    marginTop: 40,
  },
  title: {
    fontSize: 25,
    color: "#000",
    fontWeight: "600",
  },
  content: {
    color: placeholderColor,
    marginTop: 15,
    fontSize: 15,
    lineHeight: 25,
  },
  chatListContainer: {
    flex: 1, // Takes the remaining height
    marginTop: 30,
    backgroundColor: "#fff",
  },
  chatList: {
    flexGrow: 1, // Allows content to grow and be scrollable
  },
  chatListViewContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  profileImageContainer: {
    width: "20%",
    justifyContent: "center",
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  userNameContainer: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 15,
    color: "#000",
    fontWeight: "600",
  },
  parameterAlertContainer: {
    position: "absolute",
    right: 30, // Adjust this based on where exactly you want it
    top: 40,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  addFriendContainer: {
    width: "25%",
    // backgroundColor:"red"
  },
  addFriendButtonView: {
    borderWidth: 1,
    borderColor: whiteButtonTextColor,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  leaderTitleContainer: {
    flexDirection: "row",
    marginVertical: 15,
    marginHorizontal: 15,
    justifyContent: "space-between",
  },
  sunMoonIcon: {
    height: 25,
    width: 25,
    marginLeft: 5,
    marginTop: -7,
  },
  mainContainer: {
    flexDirection: "row",
    // overflow:"visible",
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "transparent",
    marginHorizontal: 20,
    padding: 10,
    marginBottom: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    borderRadius: 10,
  },
  imageContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:"red"
  },
  image: {
    height: 50,
    width: 50,
  },
  contentContainer: {
    flex: 1,
  },
  borderContentContainer: {
    borderWidth: 1,
    borderColor: placeholderColor,
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  borderContent: {
    color: "#000",
    fontWeight: "600",
  },
  Title: {
    fontSize: 20,
    color: "#000",
    fontWeight: "600",
    marginTop: 5,

    //  width:"80%"
  },
  price: {
    color: whiteButtonTextColor,
    fontSize: 20,
    fontWeight: "600",
    marginTop: 5,
  },
  description: {
    color: textColor,
    marginTop: 5,
    fontSize: 15,
  },
  iconsContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  weedIcon: {
    height: 20,
    width: 20,
    tintColor: whiteButtonTextColor,
  },
  caText: {
    color: redColor,
    marginLeft: 5,
  },
  ozText: {
    color: "#000",
    marginLeft: 5,
  },
  ratingText: {
    color: redColor,
    marginLeft: 5,
  },
  cardHeaderContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  correctSignContainer: {
    width: "10%",
    justifyContent: "center",
  },
  tickBoxContainer: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: whiteButtonTextColor,
    justifyContent: "center",
  },
  tickSymbol: {
    fontSize: 12,
    color: "#fff",
  },
  sendbuttonContainer: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    paddingHorizontal: 15,
    backgroundColor: whiteButtonTextColor,
    paddingVertical: 15,
    borderRadius: 10,
  },
  sendButtonText: {
    color: "#fff",
  },
  myFriendsContainer: {
    flexDirection: "row",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: placeholderColor,
    paddingBottom: 10,
  },
  chatDetailHeaderContainer: {
    height: 50,
    backgroundColor: "#fff",
    flexDirection: "row",
 borderBottomWidth:0.5,
 borderColor:"#ccc",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
  //  shadowRadius: 4,
  //  elevation: 5,
  },
  chatDetailBackbuttonContainer: {
 // backgroundColor:"green",
    justifyContent: "center",
    paddingLeft:20,
    width: "15%",
  },
  chatDetailHeaderUserProfileConatiner: {
    justifyContent: "center",
    alignItems: "center",
  },
  chatDetailHeaderImageContainer: {
    height: 40,
    width: 40,
    alignSelf: "center",
  },
  chatDetailHeaderContentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
  },
  chatDetailHeaderUserName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
});
