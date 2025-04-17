import {  Alert, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from './styles'
import TopBar from '../../Components/Topbar'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { hiddenCardsApi } from '../../Constants/ApiUrls';
import { authenticatedGetRequest } from '../../Components/CustomApi/getApi';
import { loginStrings } from '../Login/strings';
import CardList from '../../Components/ReuseComponents/CardList';
import NoDataView from '../../Components/ReuseComponents/NoDataView';

type settingScreenProps = NativeStackScreenProps<any, "Settings">;
export default function HiddenCards({navigation} : settingScreenProps) {
    const [isLoading, setLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [hideenCardData, setHiddenCardData] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(()=>{
        HiddenCardApiCalling()
    },[])

    const HiddenCardApiCalling = async (nextPage = 1, isRefreshing = false) => {
        if (isLoading || isLoadingMore || (!hasMore && !isRefreshing)) return;
      
        try {
          if (isRefreshing) {
            setLoading(true);
            setPage(1);
            setHasMore(true);
          } else {
            setIsLoadingMore(true);
          }
      
          const exactUrl = `${hiddenCardsApi}?page=${nextPage}&per_page=20`;
          const favouriteData = await authenticatedGetRequest(exactUrl);
      
          if (!favouriteData || favouriteData.status !== "success") {
            throw new Error("Failed to fetch categories");
          }
      
          const newCards = favouriteData.data.data || [];
      
          if (isRefreshing) {
            setHiddenCardData(newCards);
          } else {
            //@ts-expect-error
            setHiddenCardData((prev) => [...prev, ...newCards]);
          }
      
          // Check if more data is available
          if (newCards.length < 20) {
            setHasMore(false);
          }
      
          setPage(nextPage);
        } catch (error) {
          handleError(error);
        } finally {
          setLoading(false);
          setIsLoadingMore(false); // <-- This is important!
        }
      };

      const handleError = (error: unknown) => {
        let errorMessage = "An unexpected error occurred.";
        if (error instanceof Error) errorMessage = error.message;
        Alert.alert(loginStrings.error, errorMessage);
        console.log("API Error:", errorMessage);
      };


  return (
    <View style={styles.settingScreenContainer}>
    <TopBar
        showBack={true}
        backButtonPress={() => navigation.pop()}
        showNotification={false}
        showTitle={true}
        title="Hidden Cards"
      />


{hideenCardData.length > 0 ? (
        <View style={styles.cardListContainer}>
          <Text style={styles.title}>Hidden Cards</Text>
          <CardList
  data={hideenCardData}
  loginNav={() => navigation.navigate("LoginStack")}
  cardFavouriteClicked={() => HiddenCardApiCalling(1, true)} // Refresh data
  loadMoreData={() => {
    if (hasMore && !isLoading && !isLoadingMore) {
      HiddenCardApiCalling(page + 1);
    }
  }}
  hasMore={hasMore} // Prevent unnecessary calls
  activeDropdown={activeDropdown}
  setActiveDropdown={setActiveDropdown}
  hiddenCardSuccess={()=>HiddenCardApiCalling(1, true)} 
/>
        </View>
      ) : (
        <NoDataView />
      )}


    </View>
  )
}

