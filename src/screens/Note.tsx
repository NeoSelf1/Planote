import { gql, useQuery,useMutation } from '@apollo/client';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { Title } from './CreateNote_1';
import { Button } from './CreateNote_1';
import { colors } from '../../colors';

const NOTE_QUERY = gql`
  query seeNote($offset: Int!) {
    seeNote(offset: $offset) {
      notes {
        id
        title
        noteArray
        imgArray
      }
    }
  }
`;

const DELETENOTE_MUTATION = gql`
  mutation deleteNote($id: Int!) {
    deleteNote(id: $id) {
      ok
      error
    }
  }
`;

const XButton = styled.TouchableOpacity`
  padding: 15px 10px;
  border-radius: 3px;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Note({ navigation }: any) {
  const { data, loading, refetch } = useQuery(NOTE_QUERY, {
    // fetchPolicy: 'network-only',
    variables: { 
      offset: 0,
    },
    onError: (e)=> {
      console.log(JSON.stringify(e, null, 2));
    }
  });
  
  const onCompleted = (data: any) => {
    const {
      deleteNote: { ok },
    } = data;
    console.log(data);
    if (ok) {
      console.log('successfully Deleted!')
      refresh()
    }
  };

  const [deleteNote] = useMutation(DELETENOTE_MUTATION, {
    onCompleted,
    onError: (e:any)=> {
      console.log(JSON.stringify(e, null, 2));
    },
  });

  const _delete = (myId:any) => {
    deleteNote({variables:{
      id: myId
    }})
  }
  const movingToNoteview = (noteArr:string,imgArr:string)=>{
    navigation.navigate('ViewNote0617',{noteArr,imgArr});
  }
  
  const renderNote = ({ item:note }: any) => {
    return (
    <TouchableOpacity style={{ 
      backgroundColor: '#ffffff',
      marginBottom: 10,
      padding: 15, 
      flex: 1, 
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems: 'center',
      borderRadius: 16
      }}
      onPress={()=>movingToNoteview(note.noteArray,note.imgArray)}
      >
      <Text style={{color:'#282828',fontSize:22}}>
        {note.title}
      </Text>
      <XButton onPress={( )=>_delete(note.id)}> 
        <Ionicons
              name='close-outline'
              color='#282828'
              size={36}
        />
        </XButton>
      </TouchableOpacity>);
  };

  const createNote = () => {
    navigation.navigate('CreateNote')//Temporary Change for Test)
  }
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  
  const [refreshing, setRefreshing] = useState(false);

  return (
    <ScreenLayout loading={loading || refreshing}>
      <Title>악보목록</Title>
      <FlatList
        onEndReachedThreshold={0.05}
        refreshing={refreshing}
        onRefresh={refresh}
        style={{ width: '54%', backgroundColor:'#ececec', padding:12 ,borderRadius: 12}}
        showsVerticalScrollIndicator={false} 
        data={data?.seeNote?.notes}
        keyExtractor={(note) => note.id}
        renderItem={renderNote}
      />
      <Button style={{backgroundColor:colors.green,position:'absolute',bottom:'4%',right:'4%'}} onPress={createNote}>
        <Text style={{color:'white'}}>악보 추가</Text>
      </Button>
      <Button style={{backgroundColor:"#e2e2e2",position:'absolute',top:'4%',right:'4%'}} onPress={()=>refresh()}>
        <Text style={{color:'#727272'}}>새로고침</Text>
      </Button>
    </ScreenLayout>
  );
}