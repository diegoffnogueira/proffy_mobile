import React, {useState} from "react";
import {ScrollView, Text, TextInput, View} from "react-native";

import styles from "./styles"
import PageHeader from "../../components/PageHeader";
import TeacherItem, {Teacher} from "../../components/TeacherItem";
import {BorderlessButton, RectButton} from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons"
import api from "../../services/api";

function TeacherList() {

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [teachers, setTeachers] = useState([]);

  const [subject, setSubject] = useState("");
  const [week_day, setWeek_day] = useState("");
  const [time, setTime] = useState("");
  
  async function handleFilterSubmit() {
    const response = await api.get('classes', {
      params:{
        subject,
        week_day,
        time
      }
    })

    setIsFiltersVisible(false);
    setTeachers(response.data);
  }

  function handleToggleFiltersVisible() {
    setIsFiltersVisible(!isFiltersVisible);
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys disponíveis"
        headerRight={(
        <BorderlessButton onPress={handleToggleFiltersVisible}>
          <Feather name="filter" size={20} color="#FFF"/>
        </BorderlessButton>
      )}>
        { isFiltersVisible && (
          <>
            <View style={styles.searchForm}>
              <Text style={styles.label}>
                Matéria
              </Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={text => setSubject(text)}
                placeholder="Qual a matéria?"
                placeholderTextColor="#C1BCCC"
              />

              <View style={styles.inputGroup}>
                <View style={styles.inputBlock}>
                  <Text style={styles.label}>
                    Dia da semana
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Qual o dia?"
                    value={week_day}
                    onChangeText={text => setWeek_day(text)}
                    placeholderTextColor="#C1BCCC"
                  />
                </View>

                <View style={styles.inputBlock}>
                  <Text style={styles.label}>
                    Horário
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Qual o horário?"
                    value={time}
                    onChangeText={text => setTime(text)}
                    placeholderTextColor="#C1BCCC"
                  />
                </View>
              </View>

              <RectButton style={styles.submitButton} onPress={handleFilterSubmit}>
                <Text style={styles.submitButtonText}>Filtrar</Text>
              </RectButton>
            </View>
          </>
          )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16
        }}
      >
        {teachers.map((teacher:Teacher) => <TeacherItem key={teacher.id} teacher={teacher}/>)}
      </ScrollView>
    </View>
  )
}

export default TeacherList;