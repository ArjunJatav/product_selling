import { StyleSheet } from "react-native";
import { placeholderColor, seaBlueColor } from "../../Components/Colors";

export const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileTitle: {
    fontSize: 25,
    color: "#000",
    alignSelf: "center",
    marginTop: 30,
    fontWeight: "600",
    textTransform:'capitalize'
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
  inputContainer: {
    marginTop: 10,
  },
  buttonContainer: {
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    borderColor: placeholderColor,
  },
  buttonIconContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTitleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonToggleContainer: {
    width: "20%",
  },
  buttonTitle: {
    marginLeft: 10,
    color: placeholderColor,
  },
  nextButtonContainer: {
    marginTop: 30,
    marginHorizontal:10
  },
  profileImage: {
    height: 88,
    width: 88,
    borderWidth: 1,
    borderRadius: 44,
  },
});
