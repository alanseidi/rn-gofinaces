import React from "react";
import {
  Container,
  Title,
  Icon
} from "./styles";

interface Props {
  title: string;
  onPress: () => void;
}

export default function Select({title, onPress} : Props){
  return(
    <Container onPress={onPress}>
      <Title>{title}</Title>
      <Icon name="chevron-down"/>
    </Container>
  )
}
