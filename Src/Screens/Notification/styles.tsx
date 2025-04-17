import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationContainer: {
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
  title: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    color: "#000",
    fontSize: 15,
    marginTop:5
  },
  // noDataContainer:{
  //   height:"100%",width:"100%"
  // }
});
