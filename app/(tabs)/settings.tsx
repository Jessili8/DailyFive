import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Moon,
  Sun,
  MonitorSmartphone,
  Bell,
  Heart,
  Share2,
  Download,
  Languages,
} from 'lucide-react-native';
import { spacing, fontFamily, fontSizes, borderRadius } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useEntries } from '@/hooks/useEntries';
import { format } from 'date-fns';
import { useNotifications } from '@/hooks/useNotifications';

export default function SettingsScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { exportToCSV, loading } = useEntries();
  const { enableNotifications, disableNotifications, getNotificationStatus } = useNotifications();
  
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = React.useState(false);

  useEffect(() => {
    getNotificationStatus().then(setNotificationsEnabled);
  }, []);

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const success = await enableNotifications();
      setNotificationsEnabled(success);
      if (!success && Platform.OS === 'web') {
        alert('Please enable notifications in your browser settings to receive daily reminders.');
      }
    } else {
      await disableNotifications();
      setNotificationsEnabled(false);
    }
  };

  const SettingItem = ({ 
    icon, 
    title, 
    right, 
    onPress,
    delay = 0,
    loading = false,
  }: { 
    icon: React.ReactNode;
    title: string;
    right?: React.ReactNode;
    onPress?: () => void;
    delay?: number;
    loading?: boolean;
  }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(delay)}>
      <TouchableOpacity 
        style={[
          styles.settingItem, 
          { backgroundColor: colors.card, borderColor: colors.border }
        ]}
        onPress={onPress}
        disabled={!onPress || loading}
      >
        <View style={styles.settingItemLeft}>
          {icon}
          <Text style={[styles.settingItemTitle, { color: colors.text }]}>
            {title}
          </Text>
        </View>
        <View style={styles.settingItemRight}>
          {right}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const handleExport = async () => {
    const csv = await exportToCSV();
    
    if (csv) {
      if (Platform.OS === 'web') {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `daily-five-entries-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const shareApp = () => {
    console.log('Share app feature would go here');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Animated.View 
        entering={FadeInDown.duration(400)}
        style={[styles.section, { borderBottomColor: colors.border }]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('settings.appearance')}
        </Text>
        
        <View style={styles.themeSelector}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              { 
                backgroundColor: theme === 'light' ? colors.primary[500] : colors.surface,
                borderColor: theme === 'light' ? colors.primary[500] : colors.border,
              }
            ]}
            onPress={() => setTheme('light')}
          >
            <Sun 
              size={20} 
              color={theme === 'light' ? 'white' : colors.textSecondary} 
            />
            <Text 
              style={[
                styles.themeOptionText,
                { color: theme === 'light' ? 'white' : colors.text }
              ]}
            >
              {t('settings.light')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.themeOption,
              { 
                backgroundColor: theme === 'dark' ? colors.primary[500] : colors.surface,
                borderColor: theme === 'dark' ? colors.primary[500] : colors.border,
              }
            ]}
            onPress={() => setTheme('dark')}
          >
            <Moon 
              size={20} 
              color={theme === 'dark' ? 'white' : colors.textSecondary} 
            />
            <Text 
              style={[
                styles.themeOptionText,
                { color: theme === 'dark' ? 'white' : colors.text }
              ]}
            >
              {t('settings.dark')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.themeOption,
              { 
                backgroundColor: theme === 'system' ? colors.primary[500] : colors.surface,
                borderColor: theme === 'system' ? colors.primary[500] : colors.border,
              }
            ]}
            onPress={() => setTheme('system')}
          >
            <MonitorSmartphone 
              size={20} 
              color={theme === 'system' ? 'white' : colors.textSecondary} 
            />
            <Text 
              style={[
                styles.themeOptionText,
                { color: theme === 'system' ? 'white' : colors.text }
              ]}
            >
              {t('settings.system')}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('settings.preferences')}
        </Text>

        <SettingItem 
          icon={<Languages size={22} color={colors.primary[500]} />}
          title={t('settings.language')}
          right={
            <TouchableOpacity
              onPress={() => setShowLanguageOptions(!showLanguageOptions)}
              style={styles.languageButton}
            >
              <Text style={[styles.languageText, { color: colors.primary[600] }]}>
                {language === 'en' ? t('settings.english') : t('settings.chinese')}
              </Text>
            </TouchableOpacity>
          }
          delay={50}
        />

        {showLanguageOptions && (
          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                { 
                  backgroundColor: language === 'en' ? colors.primary[500] : colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => {
                setLanguage('en');
                setShowLanguageOptions(false);
              }}
            >
              <Text 
                style={[
                  styles.languageOptionText,
                  { color: language === 'en' ? 'white' : colors.text }
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.languageOption,
                { 
                  backgroundColor: language === 'zh' ? colors.primary[500] : colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => {
                setLanguage('zh');
                setShowLanguageOptions(false);
              }}
            >
              <Text 
                style={[
                  styles.languageOptionText,
                  { color: language === 'zh' ? 'white' : colors.text }
                ]}
              >
                繁體中文
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        <SettingItem 
          icon={<Bell size={22} color={colors.primary[500]} />}
          title={t('settings.dailyReminder')}
          right={
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ 
                false: colors.disabled, 
                true: colors.primary[400] 
              }}
              thumbColor={notificationsEnabled ? colors.primary[600] : colors.textSecondary}
            />
          }
          delay={100}
        />
        
        <SettingItem 
          icon={<Download size={22} color={colors.primary[500]} />}
          title={t('settings.exportToCsv')}
          right={
            <Text style={[styles.actionText, { color: colors.primary[600] }]}>
              {loading ? 'Exporting...' : t('settings.exportToCsv')}
            </Text>
          }
          onPress={handleExport}
          loading={loading}
          delay={200}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('settings.about')}
        </Text>
        
        <SettingItem 
          icon={<Heart size={22} color={colors.primary[500]} />}
          title={t('settings.rateApp')}
          onPress={() => {}}
          delay={400}
        />
        
        <SettingItem 
          icon={<Share2 size={22} color={colors.primary[500]} />}
          title={t('settings.shareWithFriends')}
          onPress={shareApp}
          delay={500}
        />
      </View>

      <Text style={[styles.versionText, { color: colors.textSecondary }]}>
        {t('settings.version')} 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSizes.xs,
    marginBottom: spacing.md,
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  themeOptionText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSizes.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingItemTitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSizes.md,
  },
  settingItemRight: {},
  actionText: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSizes.sm,
  },
  versionText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSizes.xs,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  languageButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  languageText: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSizes.sm,
  },
  languageOptions: {
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  languageOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  languageOptionText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSizes.md,
    textAlign: 'center',
  },
});