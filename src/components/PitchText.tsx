import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../colors';

const Button = styled.TouchableOpacity`
  background-color: ${colors.green};
  padding: 15px 10px;
  border-radius: 3px;
  width: 100%;
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
`;

const MyText = styled.Text`
  color: black;
  font-weight: 600;
  text-align: center;
  position: absolute;
`;

export default function PitchText({ text,x,y,myKey}: any) {
  return (
    <MyText style={{left:x/3,top:y/3}} key={myKey}> 
      {text}
    </MyText>
  );
}
