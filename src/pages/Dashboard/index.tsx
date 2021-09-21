import React from "react";
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlighCards
} from './styles';
import {HighlighCard} from "../../components/HighlighCard";

export default function Dashboard(){
  return(
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{uri: 'https://avatars.githubusercontent.com/u/4439042?v=4'}}
            />
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>Alan Seidi</UserName>
            </User>
          </UserInfo>
          <Icon name="power"/>
        </UserWrapper>
      </Header>

      <HighlighCards>
        <HighlighCard />
        <HighlighCard />
        <HighlighCard />
      </HighlighCards>

    </Container>
  );
}
