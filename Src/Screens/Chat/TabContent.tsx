import ChatItem from "./ChatItem";
import { chatStrings } from "./strings";

export const tabContentMap: Record<
string,
{
  title: string;
  content: string;
  showAddFriendButton: boolean;
  NodataText: string;
  showListingCount: boolean;
}
> = {
Friends: {
  title: chatStrings.friends,
  content: chatStrings.friendContent,
  showAddFriendButton: false,
  NodataText: chatStrings.noFriends,
  showListingCount: false,
},
Stores: {
  title: chatStrings.stores,
  content: chatStrings.storesContent,
  showAddFriendButton: true,
  NodataText: chatStrings.noStores,
  showListingCount: false,
},
People: {
  title: chatStrings.people,
  content: chatStrings.peopleContent,
  showAddFriendButton: true,
  NodataText: chatStrings.noPeople,
  showListingCount: false,
},
Leaders: {
  title: chatStrings.leaderBoard,
  content: chatStrings.leadersContent,
  showAddFriendButton: false,
  NodataText: chatStrings.noLeaders,
  showListingCount: true,
},
};

interface ChatItemType {
    imageLoc: string;
    full_name: string;
    listing_count: number;
    id: number;
    friend_request_status: string;
  }

  
type RenderChatItemProps = {
    item: ChatItemType;
    selectedTab: string;
    tabContentMap: Record<
      string,
      {
        title: string;
        content: string;
        showAddFriendButton: boolean;
        NodataText: string;
        showListingCount: boolean;
      }
    >;
    navigation: any; // Use proper navigation type if available (e.g., from @react-navigation)
    setAddButtonClickedObj: (obj: { friend_request_status: string; id: number }) => void;
    setSentRequestId: (id: number) => void;
    setShowRequestAlert: (show: boolean) => void;
    setRequestAlertTitle: (title: string) => void;
    setRequestAlertFirstIconName: (name: string) => void;
    setRequestAlertFirstIconFrom: (from: string) => void;
    setRequestAlertSecondIconName: (name: string) => void;
    setRequestAlertSecondIconFrom: (from: string) => void;
  };


export const renderChatItem = ({
    item,
    selectedTab,
    tabContentMap,
    navigation,
    setAddButtonClickedObj,
    setSentRequestId,
    setShowRequestAlert,
    setRequestAlertTitle,
    setRequestAlertFirstIconName,
    setRequestAlertFirstIconFrom,
    setRequestAlertSecondIconName,
    setRequestAlertSecondIconFrom,
  }: RenderChatItemProps) => {
    return (
      <ChatItem
        item={item}
        selectedTab={selectedTab}
        tabContentMap={tabContentMap}
        onProfilePress={() => navigation.navigate('UserProfile', { userId: item.id })}
        onChatPress={() => {
          console.log("item:::",item)
          if (item.friend_request_status === 'FRIEND') {
            navigation.navigate('ChatDetail', { friendData: item });
          }
        }}
        onAddButtonPress={() => {
          setAddButtonClickedObj(item);
          setRequestAlertTitle(
            item.friend_request_status === 'FRIEND_REQUEST_SENDED'
              ? 'Are you sure you want to cancel request?'
              : item.friend_request_status === 'FRIEND_REQUEST_RECEIVED'
              ? selectedTab === 'Stores'
                ? 'This Store has sent you request, What would you like to do?'
                : 'This User has sent you request, What would you like to do?'
              : selectedTab === 'Stores'
              ? 'Are you sure you want to add this store as a friend?'
              : 'Are you sure you want to add this user as a friend?'
          );
          setRequestAlertFirstIconName('person-add-alt-1');
          setRequestAlertFirstIconFrom('MaterialIcons');
          setRequestAlertSecondIconFrom('MaterialIcons');
          setRequestAlertSecondIconName('person-add-disabled');
          setSentRequestId(item.id);
          setShowRequestAlert(true);
        }}
      />
    );
  };
