import { Text, View } from "react-native";
import { styles } from "./styles";
import { homeStrings } from "./strings";

interface ProfileHeaderProps {
  userData: any;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData }) => (
  <View
    style={{
      backgroundColor: "#fff",
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderColor: "transparent",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 }, // ✅ only bottom
      shadowOpacity: 0.15,
      shadowRadius: 1,
      elevation: 1, // Android shadow
      zIndex: 1, // optional, in case things overlap
      marginBottom:40
    }}
  >
    <View style={styles.borderLineView} />
    <View style={styles.totalListingAndFriendContainer}>
      <View>
        <Text style={[styles.listingText, { marginTop: 12 }]}>
          {userData.listing_count}
        </Text>
        <Text style={styles.listingText}>{homeStrings.listings}</Text>
      </View>
      <View>
        <Text style={[styles.listingText, { marginTop: 12 }]}>
          {userData.friends_count}
        </Text>
        <Text style={styles.listingText}>{homeStrings.friends}</Text>
      </View>
    </View>
  </View>
);
