import React from "react";
import {Platform} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/Register";
import Resume from "../pages/Resume";
import theme from "../global/styles/theme";


const {Navigator, Screen} = createBottomTabNavigator();

export default function AppRoutes(){
  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text_light,
        tabBarLabelPosition: 'beside-icon',
        headerShown: false,
        tabBarStyle: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: 60
        }
      }}
    >
      <Screen
        name="Listagem"
        component={Dashboard}
        options={{
          tabBarIcon: (({size, color}) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          ))
        }}
      />
      <Screen
        name="Cadastrar"
        component={Register}
        options={{
          tabBarIcon: (({size, color}) => (
            <MaterialIcons
              name="attach-money"
              size={size}
              color={color}
            />
          ))
        }}
      />
      <Screen
        name="Resumo"
        component={Resume}
        options={{
          tabBarIcon: (({size, color}) => (
            <MaterialIcons
              name="pie-chart"
              size={size}
              color={color}
            />
          ))
        }}
      />
    </Navigator>
  );
}
