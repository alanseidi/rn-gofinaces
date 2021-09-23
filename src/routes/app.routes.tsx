import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/Register";

const {Navigator, Screen} = createBottomTabNavigator();

export default function AppRoutes(){
  return (
    <Navigator>
      <Screen
        name="Listagem"
        component={Dashboard}
      />
      <Screen
        name="Cadastrar"
        component={Register}
      />
    </Navigator>
  );
}
