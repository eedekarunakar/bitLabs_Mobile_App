import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useJobAlerts } from '@viewmodel/Alert/Notificationmodel'; // Importing useJobAlerts from Notificationmodel.ts
import { JobAlert } from '@services/Alert/NotificationServieces'; // Importing JobAlert interface from NotificationServieces.ts

import { useNavigation } from '@react-navigation/native';
import { useJobViewModel } from '@viewmodel/Alert/navigationModel';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@models/Model';


const NotificationsPage: React.FC = () => {
  const { jobAlerts,  handleMarkAsSeen } = useJobAlerts(); // useJobAlerts is used here to get job alerts and unseen count

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'JobDetailsScreen'>>();

  const { getJobDetails } = useJobViewModel();
  const formatDate = (dateArray: number[]): string => {
    const [year, month, day, hour, minute, second] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute, second);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };


  const renderItem = ({ item }: { item: JobAlert }) => (
    <TouchableOpacity
      onPress={() => {
        handleMarkAsSeen(item.alertsId);
        const jobId = item.applyJob.job.id;
        const apply = item.applyJob.applyjobid
        console.log('id', apply);
        getJobDetails(jobId, apply).then((jobDetails) => {
          navigation.navigate('JobDetailsScreen', { job: jobDetails });
        });

      }}
      style={[styles.notificationCard, item.seen ? styles.read : null]}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>{item.seen ? '○' : '●'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.message, item.seen ? styles.readText : null]}>
          Your application status has been marked as {item.status} by{' '}
          {item.companyName} for {item.jobTitle} role.
        </Text>
        {item.applyJob && (
          <Text style={styles.jobTitle}>{item.applyJob.jobTitle}</Text>
        )}
        <View style={styles.dateWrapper}>
          <Text style={[styles.dateInfo, item.seen ? styles.readText : null]}>
            {formatDate(item.changeDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        No alerts are found.
      </Text>
      <FlatList
        data={jobAlerts}
        keyExtractor={item => item.alertsId.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  read: {
    backgroundColor: '#E5EAF5',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 18,
    color: '#3384E3',
    fontFamily: "PlusJakartaSans-Bold",
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  message: {
    fontFamily: "PlusJakartaSans-Medium",
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
  },
  jobTitle: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 14,
    fontWeight: '600',
    color: '#3384E3',
  },
  dateWrapper: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  dateInfo: {
    fontSize: 12,
    color: '#999',
    fontFamily:'PlusJakartaSans-Medium'
  },
  readText: {
    color: '#666',
    fontFamily:'PlusJakartaSans-Medium'
  },
});

export default NotificationsPage;