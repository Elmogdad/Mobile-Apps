// TeacherCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TeacherCard = ({
    name,
    title,
    rating,
    reviews,
    avatarImage,
    isFavorite,
    onFavorite,
    price,
    onPress,
    style
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <Image
                    source={{uri:avatarImage}}
                    style={styles.image}
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.title}>
                        {title} | <MaterialIcons name="star" size={16} color="#FFC107" /> {rating} {reviews ? reviews + 'reviews': ''}
                    </Text>
                </View>
                <View>

                   {  price ? <Text style={styles.price}>{price} ر.س</Text> : null}
                   
                </View>
            </View>

      

            {/* <TouchableOpacity
                style={styles.favoriteButton}
                onPress={onFavorite}
            >
                <MaterialIcons
                    name={isFavorite ? 'favorite' : 'favorite-border'}
                    size={24}
                    color="#6B7280"
                />
            </TouchableOpacity> */}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        marginBottom: 12,
        borderColor: '#F3F4F6',
        borderWidth: 1
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 64,
        height: 64,
        borderRadius: 16,
        marginRight: 12,
        borderColor: '#ccc',
        borderWidth: 1
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 4,
    },
    title: {
        fontSize: 14,
        color: '#6B7280',
    },
    favoriteButton: {
        padding: 4,
    },
    price: {
        fontWeight: '700',
        fontSize: 14
    }
});

export default TeacherCard;