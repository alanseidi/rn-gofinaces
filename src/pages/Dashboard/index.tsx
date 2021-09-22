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
  HighlighCards,
  Transactions,
  Title,
  TransactionList,
} from './styles';
import {HighlighCard} from "../../components/HighlighCard";
import TransactionCard, {TransactionCardProps} from "../../components/TransactionCard";

export interface TransactionCardListProps extends TransactionCardProps{
  id: string;
}

export default function Dashboard(){
  const data: TransactionCardListProps[] = [
    {
      id: '1',
      type: 'positive',
      title: "Desenvolvimento de site",
      amount: "R$ 10.000,00",
      category: {
        name: "Vendas",
        icon: "dollar-sign"
      },
      date:"13/06/2021"
    },
    {
      id: '2',
      type: 'negative',
      title: "Desenvolvimento de site",
      amount: "R$ 10.000,00",
      category: {
        name: "Vendas",
        icon: "dollar-sign"
      },
      date:"13/06/2021"
    },
    {
      id: '3',
      type: 'positive',
      title: "Desenvolvimento de site",
      amount: "R$ 10.000,00",
      category: {
        name: "Vendas",
        icon: "dollar-sign"
      },
      date:"13/06/2021"
    },
    {
      id: '4',
      type: 'negative',
      title: "Desenvolvimento de site",
      amount: "R$ 10.000,00",
      category: {
        name: "Vendas",
        icon: "dollar-sign"
      },
      date:"13/06/2021"
    }
  ];
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
        <HighlighCard
          title="Entradas"
          amount="R$ 12.000,00"
          lastTransaction="Última entrada dia 20 de janeiro"
          type="up"
        />
        <HighlighCard
          title="Saídas"
          amount="R$ 12.000,00"
          lastTransaction="Última entrada dia 21 de janeiro"
          type="down"
        />
        <HighlighCard
          title="Total"
          amount="R$ 12.000,00"
          lastTransaction="01 a 30 de Janeiro"
          type="total"
        />

      </HighlighCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => <TransactionCard data={item}/>}
        />

      </Transactions>
    </Container>
  );
}
