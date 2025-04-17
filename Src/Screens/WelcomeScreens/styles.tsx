import {StyleSheet} from 'react-native';
import {guestTextColor} from '../../Components/Colors';

export const styles = StyleSheet.create({
  welcomeScreenContainer: {
    flex: 1,
  
  },
  welcomeFirstBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    top: '30%', 
    width: '90%',
    alignItems: 'center',
  },
  firstWelcomeText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
    textAlign: "center",
    marginHorizontal: 20
  },
  firstWelcomePara: {
    color: '#fff',
    fontSize: 17,
    marginTop: 10,
    marginHorizontal: 20,
    textAlign: "center"
  },
  dotsContainer: {
    position: 'absolute',
    bottom: '40%', 
    flexDirection: 'row',
    width: 80, 
    justifyContent: 'space-between',
  },
  oneDotContainer: {
    height: 10,
    width: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'transparent',
  },
  fixedButtonsContainer: {
    position: 'absolute',
    bottom: '10%', 
    width: "90%",
   // paddingHorizontal:10,
    alignItems: 'center',
    zIndex:100,
    alignSelf:"center"
   // backgroundColor:"red"
  },
  notReadyTextContainer: {
    position: 'absolute',
    bottom: '5%', 
    flexDirection: "row",
    alignSelf:"center"
  },
  notReadyText: {
    color: '#fff',
    fontSize: 20,
  },
  continueGuestText: {
    color: guestTextColor,
    fontSize: 20,
  },
  inactiveDot: {
    backgroundColor: "transparent",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    margin: 3,
    marginBottom:25
  },
  
  activeDot: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 3,
    marginBottom:25
  },
  
});
