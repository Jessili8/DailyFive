export type Language = 'en' | 'zh';

export const translations = {
  en: {
    settings: {
      appearance: 'APPEARANCE',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      preferences: 'PREFERENCES',
      language: 'Language',
      english: 'English',
      chinese: 'Traditional Chinese',
      dailyReminder: 'Daily Reminder',
      exportToCsv: 'Export to CSV',
      about: 'ABOUT',
      rateApp: 'Rate the App',
      shareWithFriends: 'Share with Friends',
      version: 'Version',
    },
    today: {
      whatMadeThisGreat: 'What made this day great?',
      goodThing: 'Good thing',
      saveEntries: 'Save Entries',
    },
    history: {
      noEntries: 'No entries yet. Start recording your daily highlights!',
      selectDate: 'Select Date',
    },
  },
  zh: {
    settings: {
      appearance: '外觀',
      light: '淺色',
      dark: '深色',
      system: '系統',
      preferences: '偏好設定',
      language: '語言',
      english: '英文',
      chinese: '繁體中文',
      dailyReminder: '每日提醒',
      exportToCsv: '匯出CSV',
      about: '關於',
      rateApp: '為應用評分',
      shareWithFriends: '分享給朋友',
      version: '版本',
    },
    today: {
      whatMadeThisGreat: '今天有什麼值得感恩的事？',
      goodThing: '感恩事項',
      saveEntries: '儲存紀錄',
    },
    history: {
      noEntries: '還沒有紀錄。開始記錄你的每日感恩吧！',
      selectDate: '選擇日期',
    },
  },
} as const;