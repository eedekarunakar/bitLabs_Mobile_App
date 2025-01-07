// LogoutModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface LogoutModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Icon name="logout" size={40} color="red" />
          <Text style={styles.modalTitle}>Are you sure you want to logout?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onCancel} style={[styles.logoutButton,styles.modalButton]}>
              <Text style={[styles.buttonText, { color: 'blue' }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={[styles.modalButton, styles.logoutButton]}>
              <Text style={[styles.buttonText, { color: 'red' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
  },
  logoutButton: {
    margin:8,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default LogoutModal;
