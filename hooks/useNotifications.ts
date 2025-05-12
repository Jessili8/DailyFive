import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const NOTIFICATION_ENABLED_KEY = 'daily_five_notifications_enabled';

// Configure default notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const enableNotifications = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web Notifications API
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true');
            scheduleWebNotification();
            return true;
          }
        }
        return false;
      } else {
        // Mobile notifications
        if (!Device.isDevice) {
          alert('Notifications are only supported on physical devices');
          return false;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          alert('Failed to get notification permissions');
          return false;
        }

        // Schedule daily notification
        await scheduleMobileNotification();
        await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true');
        return true;
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      return false;
    }
  };

  const disableNotifications = async () => {
    await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, 'false');
    if (Platform.OS === 'web') {
      clearWebNotification();
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const getNotificationStatus = async () => {
    const enabled = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
    return enabled === 'true';
  };

  const scheduleWebNotification = () => {
    clearWebNotification();

    const now = new Date();
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      20, // 8 PM
      0,
      0
    );

    if (now > scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    const timerId = setTimeout(() => {
      if ('Notification' in window) {
        new Notification('Daily Five Reminder', {
          body: "Time to reflect on today's moments of gratitude!",
          icon: '/favicon.png'
        });
        scheduleWebNotification();
      }
    }, timeUntilNotification);

    window.dailyFiveNotificationTimer = timerId;
  };

  const scheduleMobileNotification = async () => {
    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule new daily notification at 8 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Five Reminder',
        body: "Time to reflect on today's moments of gratitude!",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
      },
    });
  };

  const clearWebNotification = () => {
    if (window.dailyFiveNotificationTimer) {
      clearTimeout(window.dailyFiveNotificationTimer);
    }
  };

  return {
    enableNotifications,
    disableNotifications,
    getNotificationStatus
  };
}