import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PackageDetails = ({ title, subtitle, price, paidLabel }) => {
  return (
    <View style={styles.packageSection}>
      <Text style={styles.sectionTitle}>تفاصيل الحزمة</Text>
      <View style={styles.packageCard}>
        <View style={styles.packageInfo}>
          <View style={styles.iconContainer}>
            <Text style={styles.packageIcon}>💬</Text>
          </View>
          <View>
            <Text style={styles.packageTitle}>{title}</Text>
            <Text style={styles.packageSubtitle}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.priceTag}>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.paidLabel}>{paidLabel}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  packageSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    marginRight: 6,
    textAlign : 'right'
  },
  packageCard: {
    flexDirection: 'row-reverse', // تغيير الاتجاه إلى reverse
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  packageInfo: {
    flexDirection: 'row-reverse', // تغيير الاتجاه إلى reverse
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12, // تغيير إلى marginLeft
  },
  packageIcon: {
    fontSize: 20,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'right',
  },
  packageSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  priceTag: {
    alignItems: 'flex-start', // تغيير إلى flex-start
  },
  price: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paidLabel: {
    backgroundColor: '#E6FAF5',
    color: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
});

export default PackageDetails;