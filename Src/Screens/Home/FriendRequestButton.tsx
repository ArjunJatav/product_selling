import { Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

interface FriendRequestButtonProps {
    userData: any;
    user: any;
    buttonText: string;
    onPress: () => void;
  }
  
  export const FriendRequestButton: React.FC<FriendRequestButtonProps> = ({
    userData,
    user,
    buttonText,
    onPress
  }) => {
    if (userData.user.id === user.id) return null;
    
    return (
      <TouchableOpacity
        style={styles.addOrUnfriendButtonContainer}
        onPress={onPress}
      >
        <Text style={styles.addOrUnfriendButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    );
  };