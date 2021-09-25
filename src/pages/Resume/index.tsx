import React, {useCallback, useEffect, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {VictoryPie} from "victory-native";
import HistoryCard from "../../components/HistoryCard";
import {categories} from "../../utils/categories";
import {RFValue} from "react-native-responsive-fontsize";
import {useTheme} from "styled-components";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import {addMonths, format, subMonths} from "date-fns";
import {ptBR} from "date-fns/locale";
import {
  Container,
  Header,
  Title,
  LoadContainer,
} from "../../global/styles/global";
import {
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
} from "./styles";
import {ActivityIndicator} from "react-native";


interface TransactionData{
  type: 'positive' | 'negative',
  name: string;
  amount: string;
  category: string;
  date: string;
}
interface CategoryData{
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}
export default function Resume(){
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  const theme = useTheme();

  function handleDateChange(action: 'next' | 'prev') {
    if(action === 'next'){
      setSelectedDate(addMonths(selectedDate, 1));
    }else{
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }
  async function loadData(){
    setIsLoading(true);
    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const spending = responseFormatted
    .filter((spent: TransactionData) =>
      spent.type === 'negative' &&
      new Date(spent.date).getMonth() === selectedDate.getMonth() &&
      new Date(spent.date).getFullYear() === selectedDate.getFullYear()
    );
    const spendingTotal = spending.reduce((accumulator: number, spent: TransactionData) => {
      return accumulator + Number(spent.amount);
    }, 0);
    const totalByCategory: CategoryData[] = [];
    categories.forEach(category => {
      let categorySum = 0;
      spending.forEach((spent: TransactionData) => {
        if(spent.category === category.key){
          categorySum += Number(spent.amount);
        }
      });
      if(categorySum > 0){
        const total = categorySum
          .toLocaleString('pt-BR',{
            style: 'currency',
            currency: 'BRL'
          })
        const percent = `${(categorySum / spendingTotal * 100).toFixed(0)}%`;
        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          totalFormatted: total,
          color: category.color,
          percent
        });
      }
    });
    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]));
  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
            />
          </LoadContainer> :
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight()
            }}
          >
            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChange('prev')}>
                <MonthSelectIcon name="chevron-left"/>
              </MonthSelectButton>
              <Month>{format(selectedDate,'MMMM, yyyy', {locale: ptBR})}</Month>
              <MonthSelectButton onPress={() => handleDateChange('next')}>
                <MonthSelectIcon name="chevron-right"/>
              </MonthSelectButton>
            </MonthSelect>

            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels:{
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape
                  }
                }}
                labelRadius={50}
                x="percent"
                y="total"
              />
            </ChartContainer>
            {
              totalByCategories.map(item => (
                <HistoryCard
                  key={item.key}
                  title={item.name}
                  amount={item.totalFormatted}
                  color={item.color}
                />
              ))
            }
          </Content>

      }

    </Container>
  );
}
