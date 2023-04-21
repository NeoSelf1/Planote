import { gql, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ScreenLayout from '../components/ScreenLayout';

const NOTE_QUERY = gql`
  query seeNote($offset: Int!) {
    seeNote(offset: $offset) {
      ok
      notes {
        id
        title
        noteArray
        createdAt
        updatedAt
      }
    }
  }
`;


export default function Note({ navigation }: any) {
  // const [offset, setOffset] = useState(0);
  const { data, loading, refetch, fetchMore } = useQuery(NOTE_QUERY, {
    variables: {
      offset: 0,
    },
  });
  console.log('data:', data);
  const renderNote = ({ item: note }: any) => {
    return <View><Text style={{color:'black'}}>{note}</Text></View>;
  };

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
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeNote?.notes?.length,
            },
          })
        }
        refreshing={refreshing}
        onRefresh={refresh}
        style={{ width: '100%',backgroundColor:'white' }}
        showsVerticalScrollIndicator={false}
        data={data?.seeNote?.notes}
        keyExtractor={(note) => note.id}
        renderItem={renderNote}
      />
    </ScreenLayout>
  );
}