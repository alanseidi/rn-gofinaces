import React, {useEffect, useState} from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {useNavigation} from "@react-navigation/native";

import {
  Container,
  Header,
  Title,
} from "../../global/styles/global";
import {
  Form,
  Fields,
  TransactionTypes,
} from "./styles";

import {useForm} from "react-hook-form";
import InputForm from "../../components/Form/InputForm";
import Button from "../../components/Form/Button";
import TransactionTypeButton from "../../components/Form/TransactionTypeButton";
import Select from "../../components/Form/Select";
import CategorySelect from "../../modals/CategorySelect";

interface FormData{
  name: string;
  amount: number;
}

type NavigationProps = {
  navigate:(screen:string) => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório'),
});

export default function Register(){
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  });
  const navigation = useNavigation<NavigationProps>()

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm({
    resolver: yupResolver(schema)
  });
  function handleTransactionTypeSelect(type: 'positive' | 'negative'){
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }
  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }

  async function handleSubmitForm(form: FormData){
    const dataKey = "@gofinances:transactions";

    if(!transactionType){
      return Alert.alert("Selecione o tipo da transação");
    }
    if(category.key === "category"){
      return Alert.alert("Seleciona a categoria");
    }
    const data = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }
    try {
      const savedData = await AsyncStorage.getItem(dataKey);
      const currentData = savedData ? JSON.parse(savedData) : [];
      const newData = [
        ...currentData,
        data
      ];
      await AsyncStorage.setItem(dataKey, JSON.stringify(newData));
      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria'
      });
      navigation.navigate('Listagem');
    }catch (error){
      console.log(error);
      Alert.alert("Não foi possível salvar!");
    }
  }

  return(
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransactionTypes>
              <TransactionTypeButton
                title="Income"
                type="up"
                isActive={transactionType === 'positive'}
                onPress={() => handleTransactionTypeSelect("positive")}
              />
              <TransactionTypeButton
                title="Outcome"
                type="down"
                isActive={transactionType === 'negative'}
                onPress={() => handleTransactionTypeSelect("negative")}
              />
            </TransactionTypes>

            <Select
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button
            title="Enviar"
            onPress={handleSubmit(handleSubmitForm)}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
