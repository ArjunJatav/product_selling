import React from 'react';
import { View, ActivityIndicator, Modal, StyleSheet } from 'react-native';

const Loader = ({ visible } : any) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loaderContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

export default Loader;
