import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons, MaterialIcons } from "../../Components/ReactIcons";
import { placeholderColor, purpleColor } from "../../Components/Colors";
import { homeStrings } from "./strings";

interface PersonalInfoProps {
    userData: any;
  }
  interface FilterProps {
    sortingAndFilterClicked:(text: string)=> void
  }
  export const PersonalInfo: React.FC<PersonalInfoProps> = ({ userData }) => {
  
    
    return (
      <View style={styles.personalInfoContainer}>

        {userData.user.address && (
  <View style={styles.userAddressContainer}>
  {/* @ts-expect-error: Ionicons type definition is missing */}
<MaterialCommunityIcons
 name="map-marker-multiple-outline"
 size={25}
 color={placeholderColor}
/>
<Text style={styles.userAddressText}>{userData.user.address}</Text>
</View>
        )}
      

        {userData.user.phoneNumber && (
 <View style={styles.userAddressContainer}>
 {/* @ts-expect-error: Ionicons type definition is missing */}
<MaterialCommunityIcons
name="cellphone-sound"
size={25}
color={placeholderColor}
/>
<Text style={styles.userAddressText}>{userData.user.phoneNumber}</Text>
</View>
        )}
       


        {userData.user.email && (
  <View style={styles.userAddressContainer}>
  {/* @ts-expect-error: Ionicons type definition is missing */}
<MaterialCommunityIcons
 name="email-outline"
 size={25}
 color={placeholderColor}
/>
<Text style={styles.userAddressText}>{userData.user.email}</Text>
</View>
        )}
      


        {userData.user.website && (
          <View style={styles.userAddressContainer}>
             {/* @ts-expect-error: Ionicons type definition is missing */}
          <MaterialCommunityIcons
            name="monitor-cellphone"
            size={25}
            color={placeholderColor}
          />
          <Text style={styles.userAddressText}>{userData.user.website}</Text>
        </View>
        )}
        
      </View>
    );
  };

  export const FilterContainer : React.FC<FilterProps> = ({ sortingAndFilterClicked })=>{
    return <View style={styles.filterContainer}>
          <TouchableOpacity
              style={styles.sortTextContainer}
              onPress={() => sortingAndFilterClicked("sort")}
          >
              <Text style={styles.sortByText}>{homeStrings.sortBy}</Text>
              {/* @ts-expect-error: Ionicons type definition is missing */}
              <MaterialIcons
                  name="keyboard-arrow-down"
                  size={25}
                  color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
              onPress={() => sortingAndFilterClicked("filter")}
          >
              <Text
                  style={[
                      styles.sortByText,
                      { color: purpleColor, fontWeight: "600" },
                  ]}
              >
                  {homeStrings.filter}
              </Text>
          </TouchableOpacity>
      </View>;
  }