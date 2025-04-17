import { StyleSheet } from "react-native";
import {
  placeholderColor,
  redColor,
  seaBlueColor,
  textColor,
} from "../../Components/Colors";
import { windowWidth } from "../../Constants/ReuseVariables";

export const styles = StyleSheet.create({
  settingScreenContainer: {
   flex: 1,
    backgroundColor: "#fff",
  },
  heading: {
    marginTop: 20,
    color: "#000",
    fontSize: 25,
    fontWeight: "500",
  },
  screenContainer: {
    marginHorizontal: 20,
  },
  settingDescription: {
    color: placeholderColor,
    fontSize: 17,
    marginTop: 5,
    lineHeight: 25,
  },
  buttonContainer: {
    backgroundColor: seaBlueColor,
    marginTop: 20,
    flexDirection: "row",
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "transparent",
  },
  buttonIconContainer: {
    //  backgroundColor: "green",
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonTitleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonTitle: {
    color: placeholderColor,
    fontSize: 18,
  },
  buttonToggleContainer: {
    width: "20%",
  },
  locationButtonContainer: {
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    borderColor: placeholderColor,
    borderRadius: 10,
  },
  logoutButtonContainer: {
    marginTop: 20,
  },
  deleteAccountButtonContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: redColor,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  deleteAccountText: {
    color: redColor,
    fontSize: 18,
    fontWeight: "600",
  },
  privacyPolicyText: {
    color: textColor,
    marginTop: 20,
    alignSelf: "center",
    fontSize: 15,
  },
  changePasswordMainView: {
    marginTop: 80,
    borderTopWidth: 5,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    backgroundColor: "#000",
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  imageBackground: {
    flex: 1,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    overflow: "hidden",
    paddingHorizontal: 15,
    marginTop: -15,
  },
  changePasswordHeading: {
    color: "#000",
    marginTop: 35,
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 20,
  },
  changePasswordDescription: {
    color: "#000",
    fontSize: 15,
  },
  inputContainer: {
    marginTop: 20,
  },
  updatebuttonContainer: {
    marginTop: 45,
  },
  profileTitle: {
    fontSize: 25,
    color: "#000",
    alignSelf: "center",
    marginTop: 30,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  descriptionInputContainer: {
    height: 150,
    width: "100%",
    backgroundColor: seaBlueColor,
    paddingLeft: 10,
    borderRadius: 10,
  },
  profileImageContainer: {
    height: 100,
    width: 100,
    borderWidth: 1,
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: seaBlueColor,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIconContainer: {
    position: "absolute",
    zIndex: 10,
    bottom: -10,
    height: 30,
    width: 30,
    backgroundColor: "#fff",
    left: 35,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  inputViewContainer: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  labelText: {
    color: "#000",
    fontSize: 15,
    marginTop: 15,
  },
  profileImage: {
    height: 88,
    width: 88,
    borderWidth: 1,
    borderRadius: 44,
    // backgroundColor:"red"
  },
  privacyButtonContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 15,
    gap: 20,
  },
  privacyText: {
    marginHorizontal: 15,
    marginTop: 20,
    color: "#000",
    fontSize: 15,
  },
  publicButtonContainer: {
    height: (windowWidth - 70) / 3,
    width: (windowWidth - 70) / 3,
    borderRadius: 15,
    borderWidth:1,
   // borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex:100,
    borderColor:"transparent",backgroundColor:"#fff"
  },
  publicButtonText: {
    width: (windowWidth - 70) / 3,
    textAlign: "center",
    color: placeholderColor,
  },
  cardListContainer:{
    marginTop:30,marginBottom:180
},
title:{
    color:"#000",fontSize:20,marginVertical:20,marginHorizontal:20,fontWeight:"600"
}
});
