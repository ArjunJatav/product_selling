import React from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Ionicons } from '../../Components/ReactIcons';

type ChatHeaderProps = {
  title: string;
  content: string;
};
type ChatDetailHeaderProps = {
title: string;
userImage: string,
backBUttonPress: ()=>void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, content }) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};


export const ChatDetailHeader : React.FC<ChatDetailHeaderProps>= ({title,userImage,backBUttonPress})=>{
  return(
    <SafeAreaView>
<View style={styles.chatDetailHeaderContainer}>

  <TouchableOpacity style={styles.chatDetailBackbuttonContainer} onPress={backBUttonPress}>
      {/*@ts-expect-error: Icon type definition is missing */}
  <Ionicons name="chevron-back" size={22} color={"#000"} />
  </TouchableOpacity>

  <View style={styles.chatDetailHeaderUserProfileConatiner}>

<Image source={{uri:userImage}} style={styles.chatDetailHeaderImageContainer}/>
  </View>

  <View style={styles.chatDetailHeaderContentContainer}>
<Text numberOfLines={1} style={styles.chatDetailHeaderUserName}>{title}</Text>

  </View>
</View>
    </SafeAreaView>
    
  )

}
export default ChatHeader;