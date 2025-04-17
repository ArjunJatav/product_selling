import React from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { chatStrings } from './strings';

type ChatListProps = {
  chatList: any[];
  selectedTab: string;
  tabContentMap: Record<string, any>;
  onEndReached: () => void;
  loadingMore: boolean;
  renderItem: ({ item }: { item: any }) => JSX.Element;
};

const ChatList: React.FC<ChatListProps> = ({
  chatList,
  selectedTab,
  tabContentMap,
  onEndReached,
  loadingMore,
  renderItem,
}) => {
  return (
    <FlatList
      data={chatList}
      ListEmptyComponent={() => (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            {tabContentMap[selectedTab].NodataText}
          </Text>
        </View>
      )}
      ListHeaderComponent={() => {
        if (tabContentMap[selectedTab].showListingCount) {
          return (
            <View style={styles.leaderTitleContainer}>
              <Text style={{ color: '#000', fontSize: 15 }}>
                {chatStrings.leaderbyState}
              </Text>
              <Text style={{ color: '#FFA500', fontSize: 15 }}>
                {chatStrings.totalCards}
              </Text>
            </View>
          );
        }
        return null;
      }}
      contentContainerStyle={{ flexGrow: 1 }}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      ListFooterComponent={() =>
        loadingMore && <ActivityIndicator size="small" color="#0000" />
      }
    />
  );
};

export default ChatList;