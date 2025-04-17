import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getRequest } from "../CustomApi/getApi";
import { filterAndSort } from "../../Constants/ApiUrls";
import { loginStrings } from "../../Screens/Login/strings";
import Loader from "../Loader";
import { MaterialIcons } from "../ReactIcons";
import CustomButton from "../CustomButton/CustomButton";
import CustomTransparentButton from "../CustomButton/CustomTransparentButton";
import { whiteButtonTextColor } from "../Colors";
import { homeStrings } from "../../Screens/Home/strings";

type FilterComponentProps = {
  title: string;
  onSelectSort: (selectedSorting: { [key: string]: string }) => void;
  previousSorting?: { [key: string]: string };
  previousFilters?: { [key: string]: any };
  clearFilterCalled:()=> void
};

export default function FilterComponent({
  title,
  onSelectSort,
  previousFilters,
  previousSorting,
  clearFilterCalled
}: FilterComponentProps) {
  
  const [isLoading, setLoading] = useState(false);
  const [filterSortData, setFilterSortData] = useState<any[]>([]);
  const [selectedSorting, setSelectedSorting] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (title === "sort" && previousSorting && Object.keys(previousSorting).length > 0) {
      setSelectedSorting(previousSorting);
    }
    if (title === "filter" && previousFilters && Object.keys(previousFilters).length > 0) {
      setSelectedSorting(previousFilters);
    }
  }, [previousSorting, previousFilters]);

  useEffect(() => {
    filterAndSortApiCalling();
  }, []);

  const filterAndSortApiCalling = async () => {
    try {
      setLoading(true);
      const response = await getRequest(filterAndSort);

      if (!response || response.status !== "success") {
        throw new Error("Failed to fetch data");
      }

      const dataToShow =
        title === "filter" ? response.data.filters : response.data.sorting;
      setFilterSortData(dataToShow);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) errorMessage = error.message;
    Alert.alert(loginStrings.error, errorMessage);
    console.log("API Error:", errorMessage);
  };


  const handleSortSelection = (filterName: string, selectedItem: any) => {
    setSelectedSorting((prev) => {
      if (title === "filter") {
        return {
          ...prev,
          [filterName]: selectedItem, // Store full object
        };
      } else {
        console.log("IN ELSE",selectedItem)
        return {
          [filterName]: selectedItem, // Ensure valid value
        };
      }
    });
  };
  // const handleSortSelection = (filterName: string, selectedItem: any) => {
  //   setSelectedSorting((prev) => {
  //     if (title === "filter") {
  //       // Store only ONE selected filter per filter_name
  //       return {
  //         ...prev,
  //         [filterName]: selectedItem, // Override previous selection
  //       };
  //     } else {
  //       // Sorting remains single selection
  //       return { [filterName]: selectedItem.label || selectedItem.name || selectedItem.value };
  //     }
  //   });
  // };
  

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {title === "filter"
            ? homeStrings.filter + " " + "By"
            : homeStrings.sortBy}
        </Text>
      </View>

      <Loader visible={isLoading} />

      {!isLoading && (
        <FlatList
          data={filterSortData}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => (
            <>
              <View style={styles.TransbuttonContainer}>
                <CustomTransparentButton
                  text={"Clear Filters"}
                  textColor={"#000"}
                  borderColor={whiteButtonTextColor}
                  buttonPress={() => clearFilterCalled()}
                />
              </View>
              <View style={styles.buttonContainer}>
                <CustomButton
                  text={"Submit Filters"}
                  buttonPress={() => {
                    if (Object.keys(selectedSorting).length === 0) {
                      // Alert.alert("Alert","Please choose at least one filter.")
                    } else {
                      onSelectSort(selectedSorting);
                    }
                  }}
                />
              </View>
            </>
          )}
          renderItem={({ item }) => (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {title === "filter" ? item.filter_name : item.sorting_name}
              </Text>
              <FlatList
                data={item.data}
                keyExtractor={(subItem, subIndex) => subIndex.toString()}
                renderItem={({ item: subItem, index: subIndex }) => {
                  // const isSelected =
                  //   selectedSorting[item.sorting_name] === subItem?.lable;
                  const isSelected = selectedSorting[item.sorting_name] === (subItem.lable || subItem.name || subItem.value);

                    let categoryName = subItem?.lable;
                    let selectedCategory = selectedSorting[item.filter_name]?.lable;
                   if (subItem.name) {
                    categoryName = subItem?.name;
                    selectedCategory = selectedSorting[item.filter_name]?.name;
                   } else {
                    categoryName = subItem?.lable;
                    selectedCategory = selectedSorting[item.filter_name]?.lable;
                   }
                    const isSelectedFilter =
                    selectedSorting[item.filter_name] &&
                    (
                      selectedCategory === categoryName );
                  
                  return (
                    <TouchableOpacity
                      style={styles.sortItem}
                      onPress={() => {
                        if (title == "filter") {
                          handleSortSelection(
                            item.filter_name,
                            subItem
                          );
                        } else {
                          handleSortSelection(item.sorting_name, subItem.lable);
                        }
                      }}
                    >
                      <View style={styles.iconContainer}>
                        <View style={styles.iconView}>
                          {title == "filter" ? (
                            <>
                            {subItem.icon ?  <Image
                              source={{ uri: subItem.icon }}
                              style={{ height: 20, width: 20 }}
                              resizeMode="contain"
                            /> :  <Image
                            source={{ uri: subItem.image }}
                            style={{ height: 20, width: 20 }}
                            resizeMode="contain"
                          />}
                            </>
                           
                          ) : (
                            <MaterialIcons
                              name={
                                subIndex % 2 === 0
                                  ? "arrow-drop-up"
                                  : "arrow-drop-down"
                              }
                              size={40}
                              color="black"
                            />
                          )}
                        </View>
                      </View>

                      <View style={styles.labelContainer}>
                        <Text style={styles.itemText}>
                          {subItem.lable || subItem.name}
                        </Text>
                      </View>

                      <View style={styles.radioButtonContainer}>
                        <View style={[styles.radioButtonView]}>
                         
                        <View style={[
  styles.insideRadioButtonView,
  {
    backgroundColor:
      title === "filter"
        ? isSelectedFilter
          ? "#000"
          : "transparent"
        : isSelected
        ? "#000"
        : "transparent",
  },
]}
/>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#000",
    fontSize: 18,
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  section: {
    marginTop: 20,
    // backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  itemText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
    fontWeight: "400",
  },
  sortItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 20,
    // backgroundColor:"green"
  },
  iconContainer: {
    width: "15%",
    // backgroundColor: "red",
  },
  iconView: {
    height: 40,
    width: 40,
    backgroundColor: "#c4c4c4",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  radioButtonContainer: {
    width: "10%",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 6,
    //  backgroundColor: "green",
    alignItems: "flex-end",
  },
  radioButtonView: {
    height: 25,
    width: 25,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 12,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  insideRadioButtonView: {
    height: 15,
    width: 15,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 7,
  },
  labelContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 50,
  },
  TransbuttonContainer: {
    marginHorizontal: 10,
  },
});
