import { StyleSheet } from "react-native";
import { windowWidth } from "../../Constants/ReuseVariables";
import { placeholderColor, redColor, textColor, whiteButtonTextColor } from "../Colors";

export const styles = StyleSheet.create({
  colorfulImage: {
    height: 150,
    width: "100%",
  },
  iconImage: {
    height: 120,
    width: 120,
    alignSelf: "center",

    //  marginTop: -60,
  },
  userImage:{
    height: 120,
    width: 120,
    alignSelf: "center",
    borderRadius:60
  },
  title: {
    color: "#000",
    fontSize: 20,
    alignSelf: "center",
    marginTop: 10,
    fontWeight: "600",
  },
  userHeaderImageContainer: {
    height: 140,
    width: 140,
 //   backgroundColor: "red",
    alignSelf: "center",
    marginTop: -70,
    borderRadius: 70,
    justifyContent: "center",
  },
  mainContainer: {
  
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
  seedImgContainer: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 50,
    width: 50,
  },
  contentContainer: {
   flex:1
  },
  borderContentContainer: {
    borderWidth: 1,
    borderColor: placeholderColor,
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    borderRadius: 5,
  
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
  borderContent: {
    color: "#000",
    fontWeight: "600",
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
    marginLeft: 10,
  },
  ratingText: {
    color: redColor,
    marginLeft: 10,
  },
  sunMoonIcon: {
    height: 25,
    width: 25,
    marginLeft: 5,
    marginTop: -7,
  },
  threedotContainer: {
    width: "15%",
    height:"100%",
    flexDirection:"column",
    gap:17,
    // backgroundColor:"red",
  //  backgroundColor:"red",
    alignItems:"flex-end",
    position:"relative"
  },
  alertContainer: {
    position: "absolute",
    right: 20, // Adjust this based on where exactly you want it
    top: -60,
    zIndex: 555,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    
  },
  userImg: {
    height: "100%",
    width: "90%",
    alignSelf: "center",
  },
  userImgContainer: {
    height: 450,
    width: windowWidth - 20,
    alignSelf: "center",
  },
  sideImgContainer: {
    position: "absolute",
    bottom: 5,
    right: 10,
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  belowViewContainer: {
    width: "100%",
    backgroundColor: "#000",
    paddingBottom: 50,
    borderRadius: 50,
    borderBottomWidth: 0,
  },
  expandableContentContainer: {
    marginHorizontal: 25,
    marginTop: 20,
  },
  commentText: {
    marginHorizontal: 25,
    fontSize: 18,
    marginTop: 10,
    color: "#000",
  },
  sliderImage: {
    width: windowWidth - 40,
    height: 420,
    alignSelf: "center",
    borderWidth: 50,
    borderRadius: 50,
    borderTopWidth: 10,
  },
  flavoursListContainer: {
    flexDirection: "row",
    gap: 10,
    marginLeft: 25,
  },
  flavoursContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginTop: 20,
  },
  imageContentView: {
    borderBottomWidth: 10,
    borderRadius: 50,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderColor: "transparent",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.3,
    // shadowRadius: 0,
    // elevation: 50,
  },
  likesAndShareContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "red",
    marginHorizontal: 20,
    marginTop: 20,
  },
  likesAndUnlikeContainer: {
    flexDirection: "row",
    gap: 20,
  },
  numberOfLikes: {
    color: "#fff",
  },
  likeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
