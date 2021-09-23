import styled from "styled-components/native";
import {Feather} from "@expo/vector-icons";
import {RFValue} from "react-native-responsive-fontsize";

interface CategoryProps{
  isActive: boolean
}

export const Category = styled.TouchableOpacity<CategoryProps>`
  width: 100%;
  padding: ${RFValue(15)}px;
  
  flex-direction: row;
  align-items: center;
  
  background-color: ${({isActive, theme}) => 
    isActive ? theme.colors.secondary_light : theme.colors.background
  };
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  margin-right: 20px;
`;

export const Name = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
`;

export const Divider = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${({theme}) => theme.colors.text_light};
`;
export const Footer = styled.View`
  width: 100%;
  padding: 24px;
`;
