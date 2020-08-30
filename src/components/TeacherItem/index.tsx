import React, {useState} from "react";
import {Image, Text, View, Linking} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import heartOutlineIcon from "../../assets/images/icons/heart-outline.png"
import unfavoriteIcon from "../../assets/images/icons/unfavorite.png"
import whatsappIcon from "../../assets/images/icons/whatsapp.png"
import styles from "./styles";
import {RectButton} from "react-native-gesture-handler";
import api from "../../services/api";

export interface Teacher {
  id: number;
  name: string;
  bio: string;
  subject: string;
  avatar: string;
  cost: number;
  whatsapp: string;
}

interface TeacherItensProps {
  teacher: Teacher;
  favorited: boolean;
}

const TeacherItem:React.FC<TeacherItensProps> = ({ teacher, favorited }) => {

  const [isFavorited, setisFavorited] = useState(favorited);

  async function handleToggleFavorite() {
    const favorites = await AsyncStorage.getItem("favorites");

    let favoritesArray: Teacher[] = [];

    if (favorites) {
      favoritesArray = JSON.parse(favorites)
    }

    if (isFavorited) {
      // remove dos favoritos
      const favoritedIndex = favoritesArray.findIndex((teacherItem: Teacher) => {
        return teacherItem.id === teacher.id;
      })

      setisFavorited(false);
      favoritesArray.splice(favoritedIndex, 1)
    } else {
      //adiciona nos favoritos
      favoritesArray.push(teacher);

      setisFavorited(true);
    }

    await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray))
  }

  function handleLinkToWhatsapp() {
    api.post("connections", {
      user_id: teacher.id
    })

    Linking.openURL(`whatsapp://send?text=Hello World!&phone=${teacher.whatsapp}`)
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image style={styles.avatar} source={{ uri: teacher.avatar }} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.subject}>{teacher.subject}</Text>
        </View>
      </View>

      <Text style={styles.bio}>
        {teacher.bio}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.price}>
          Preço/hora {"  "}
          <Text style={styles.priceValue}>
            R$ {teacher.cost}
          </Text>
        </Text>

        <View style={styles.buttonsContainer}>
          <RectButton
            onPress={handleToggleFavorite}
            style={[styles.favoriteButton, isFavorited ? styles.favorited : {} ]}
          >
            { isFavorited ? <Image source={unfavoriteIcon} /> : <Image source={heartOutlineIcon} /> }
          </RectButton>

          <RectButton onPress={handleLinkToWhatsapp} style={styles.contactButton}>
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>
              Entrar em contato
            </Text>
          </RectButton>
        </View>
      </View>
    </View>
  )
}

export default TeacherItem;