import React from "react";
import {FlatList} from "react-native";

import Button from "../../components/Form/Button";
import {categories} from "../../utils/categories";

import {
  ContainerGesture,
  Header,
  Title,
} from "../../global/styles/global";

import {
  Category,
  Icon,
  Name,
  Divider,
  Footer
} from "./styles";


interface Category {
  key: string;
  name: string;
}
interface Props {
  category: Category;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}
export default function CategorySelect({
  category,
  setCategory,
  closeSelectCategory
  }: Props){

  function handleCategorySelect(cat: Category){
    setCategory(cat);
  }

  return(
    <ContainerGesture>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList
        data={categories}
        style={{flex: 1, width: '100%'}}
        keyExtractor={(item) => item.key}
        renderItem={({item}) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon}/>
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />

      <Footer>
        <Button
          title="Selecionar"
          onPress={closeSelectCategory}
        />
      </Footer>
    </ContainerGesture>
  );
}
