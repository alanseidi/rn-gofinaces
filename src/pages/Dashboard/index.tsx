import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from "@react-navigation/native";
import {
  LoadContainer,
} from "../../global/styles/global";

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
  LogoutButton,
} from './styles';
import {HighlighCard} from "../../components/HighlighCard";
import TransactionCard, {TransactionCardProps} from "../../components/TransactionCard";
import {useTheme} from "styled-components";
import {useAuth} from "../../hooks/auth";

export interface TransactionCardListProps extends TransactionCardProps{
  id: string;
}
interface HighlightProps {
  amount: string;
  lastTransaction: string;
}
interface HighlightData {
  entries: HighlightProps,
  spending: HighlightProps,
  total: HighlightProps,
}

export default function Dashboard(){
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionCardListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  const theme = useTheme();
  const {user, singOut} = useAuth();

  function getLastTransactionDate(
    collection: TransactionCardProps[],
    type: 'positive' | 'negative'){
    const filttered = collection.filter((transaction: TransactionCardProps)  => transaction.type === type);
    if(filttered.length === 0){
      return 0;
    }
    const lastTransaction = new Date(Math.max.apply(Math, filttered
      .map((transaction: TransactionCardProps) => new Date(transaction.date).getTime())));
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR',{month: 'long'})}`;
  }


  async function loadTransaction(){
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let spendingTotal = 0;

    const transactionsFormatted: TransactionCardListProps[] = transactions
      .map((item: TransactionCardListProps) => {
        if(item.type === 'positive'){
          entriesTotal += Number(item.amount);
        }else {
          spendingTotal += Number(item.amount);
        }

        const amount = Number(item.amount)
          .toLocaleString('pt-BR',{
            style: 'currency',
            currency: 'BRL'
          });

        const dateFormatted = Intl.DateTimeFormat('pt-BR',{
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date: dateFormatted
        }
      });
    setTransactions(transactionsFormatted);
    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionSpending = getLastTransactionDate(transactions, 'negative');
    const today = new Date();
    const totalInterval = `01 a ${today.getDate()}`;

    const total = entriesTotal - spendingTotal;
    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR',{
            style: 'currency',
            currency: 'BRL'
          }),
        lastTransaction: lastTransactionEntries === 0 ? 'N??o h?? transa????es' : `??ltima entrada dia ${lastTransactionEntries}`
      },
      spending: {
        amount: spendingTotal.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionSpending === 0 ? 'N??o h?? transa????es' : `??ltima sa??da dia ${lastTransactionSpending}`
      },
      total: {
        amount: total.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    });
    setIsLoading(false);
  }

  useEffect(() => {
    loadTransaction();
  },[]);
  useFocusEffect(useCallback(() => {
    loadTransaction();
  }, []));
  return(
    <Container>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
            />
          </LoadContainer> :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{uri: user.photo}}
                />
                <User>
                  <UserGreeting>Ol??, </UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton
                onPress={singOut}
              >
                <Icon name="power"/>
              </LogoutButton>

            </UserWrapper>
          </Header>

          <HighlighCards>
            <HighlighCard
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
              type="up"
            />
            <HighlighCard
              title="Sa??das"
              amount={highlightData.spending.amount}
              lastTransaction={highlightData.spending.lastTransaction}
              type="down"
            />
            <HighlighCard
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
              type="total"
            />

          </HighlighCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({item}) => <TransactionCard data={item}/>}
            />

          </Transactions>
        </>
      }
    </Container>
  );
}
