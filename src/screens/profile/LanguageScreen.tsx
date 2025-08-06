import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Fonts, TextStyles } from '../../constants/fonts';
import { ProfileStackParamList } from '../../navigation';
import { 
  setLanguage,
  selectCurrentLanguage,
  selectAvailableLanguages,
  selectLocalizationLoading,
} from '../../store/slices/localizationSlice';
import { 
  localizationService,
  SUPPORTED_LANGUAGES,
  LanguageConfig,
} from '../../services/api/localization';
import { t } from '../../services/api/localization';

type LanguageScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Language'>;

interface LanguageScreenProps {
  navigation: LanguageScreenNavigationProp;
}

const LanguageScreen: React.FC<LanguageScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const availableLanguages = useSelector(selectAvailableLanguages);
  const loading = useSelector(selectLocalizationLoading);

  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  // 使用本地支持的语言列表
  const languages = availableLanguages.length > 0 ? availableLanguages : SUPPORTED_LANGUAGES;

  // 处理语言选择
  const handleLanguageSelect = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    try {
      await dispatch(setLanguage(languageCode));
      // 可以在这里显示成功提示
    } catch (error) {
      // 恢复之前的选择
      setSelectedLanguage(currentLanguage);
    }
  };

  // 渲染语言项
  const renderLanguageItem = ({ item }: { item: LanguageConfig }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        selectedLanguage === item.code && styles.languageItemSelected,
      ]}
      onPress={() => handleLanguageSelect(item.code)}
      disabled={loading}
    >
      <View style={styles.languageInfo}>
        <Text style={styles.languageFlag}>{item.flag}</Text>
        <View style={styles.languageText}>
          <Text style={[
            styles.languageName,
            selectedLanguage === item.code && styles.languageNameSelected,
          ]}>
            {item.name}
          </Text>
          <Text style={[
            styles.languageNative,
            selectedLanguage === item.code && styles.languageNativeSelected,
          ]}>
            {item.nativeName}
          </Text>
        </View>
      </View>
      <View style={styles.languageStatus}>
        {loading && selectedLanguage === item.code ? (
          <ActivityIndicator size="small" color={Colors.primary[500]} />
        ) : selectedLanguage === item.code ? (
          <Ionicons name="checkmark-circle" size={24} color={Colors.primary[500]} />
        ) : (
          <View style={styles.radioButton}>
            <View style={styles.radioButtonInner} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // 渲染头部说明
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>选择语言</Text>
      <Text style={styles.headerSubtitle}>
        更改语言后，应用界面将切换到所选语言。部分翻译内容将从服务器获取。
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={languages}
        renderItem={renderLanguageItem}
        keyExtractor={(item) => item.code}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContainer: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: Colors.light.surface,
    marginBottom: 16,
  },
  headerTitle: {
    ...TextStyles.h4,
    color: Colors.light.onSurface,
    marginBottom: 8,
  },
  headerSubtitle: {
    ...TextStyles.body2,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  languageItemSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    ...TextStyles.body1,
    color: Colors.light.onSurface,
    fontWeight: '600',
    marginBottom: 2,
  },
  languageNameSelected: {
    color: Colors.primary[600],
  },
  languageNative: {
    ...TextStyles.caption,
    color: Colors.neutral[600],
  },
  languageNativeSelected: {
    color: Colors.primary[500],
  },
  languageStatus: {
    marginLeft: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
});

export default LanguageScreen;