import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import ScreenLayout from '../components/ScreenLayout';
import styled from 'styled-components/native';
import { colors } from '../../colors';

const NOTE_QUERY = gql`
  query seeNote($offset: Int!) {
    seeNote(offset: $offset) {
      notes {
        id
        title
        noteArray
      }
    }
  }
`;

const Button = styled.TouchableOpacity`
  background-color: ${colors.green};
  padding: 15px 10px;
  border-radius: 3px;
  width: 10%;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 4%;
  right: 4%;
`;
export default function Note({ navigation }: any) {
  // const [offset, setOffset] = useState(0);
  const { data, loading, refetch, fetchMore } = useQuery(NOTE_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      offset: 0,
    },
    onError: (e)=> {
      console.log(JSON.stringify(e, null, 2));
    }
  });
  const renderNote = ({ item:note }: any) => {
    console.log('note:',note.title)
    return (
    <View style={{ backgroundColor: `${colors.green}`,margin:2,padding:15, flex: 1, alignItems: 'center' }}>
      <Text style={{color:'white',fontSize:22}}>
        {note.title}
      </Text>
      </View>);
  };

  const createNote = () => {
    navigation.navigate('CreateNote_1')//Temporary Change for Test)
  }
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const [refreshing, setRefreshing] = useState(false);
  
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        onEndReachedThreshold={0.05}
        // onEndReached={() =>
        //   fetchMore({
        //     variables: {
        //       offset: data?.seeNote?.notes?.length,
        //     },
        //   })
        // }
        refreshing={refreshing}
        onRefresh={refresh}
        style={{ width: '100%',backgroundColor:'white',padding:15 }}
        showsVerticalScrollIndicator={false}
        data={data?.seeNote?.notes}
        keyExtractor={(note) => note.id}
        renderItem={renderNote}
      />
      <Button onPress={createNote}>
        <Text style={{color:'white'}}>악보 추가</Text>
      </Button>
    </ScreenLayout>
  );
}