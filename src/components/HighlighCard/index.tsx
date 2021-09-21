import React from "react";

import {
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction,
} from "./styles";

export function HighlighCard(){
  return (
    <Container>
      <Header>
        <Title>Entrada</Title>
        <Icon name="arrow-up-circle"/>
      </Header>

      <Footer>
        <Amount>R$ 12.000,00</Amount>
        <LastTransaction>Última entrada dia 10 de janeiro</LastTransaction>
      </Footer>
    </Container>
  );
}
