import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_ENABLED_KEY = 'daily_five_notifications_enabled';

export function useNotifications() {
  const enableNotifications = async () => {
    if (Platform.OS === 'web') {
      // Web Notifications API
      if ('Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true');
            // Schedule notification for 8 PM daily
            scheduleWebNotification();
            return true;
          }
        } catch (error) {
          console.error('Error enabling notifications:', error);
        }
      }
      return false;
    }
    return false;
  };

  const disableNotifications = async () => {
    await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, 'false');
    if (Platform.OS === 'web') {
      // Clear any scheduled notifications
      clearWebNotification();
    }
  };

  const getNotificationStatus = async () => {
    const enabled = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
    return enabled === 'true';
  };

  const scheduleWebNotification = () => {
    // Clear any existing notification
    clearWebNotification();

    // Calculate time until 8 PM today
    const now = new Date();
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      20, // 8 PM
      0,
      0
    );

    // If it's past 8 PM, schedule for tomorrow
    if (now > scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    // Schedule the notification
    const timerId = setTimeout(() => {
      if ('Notification' in window) {
        new Notification('Daily Five Reminder', {
          body: "Time to reflect on today's moments of gratitude!",
          icon: '/favicon.png'
        });
        // Schedule next day's notification
        scheduleWebNotification();
      }
    }, timeUntilNotification);

    // Store the timer ID
    window.dailyFiveNotificationTimer = timerId;
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