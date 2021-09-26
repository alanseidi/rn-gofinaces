import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const {CLIENT_ID} = process.env;
const {REDIRECT_URI} = process.env;

interface AuthProviderProps {
  children: ReactNode;
}
interface User{
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextData{
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  singOut(): Promise<void>;
  isUserLoading: boolean;
}
interface AuthorizationResponse{
  params: {
    access_token: string;
  },
  type: string;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({children}: AuthProviderProps){
  const [user, setUser] = useState<User>({} as User);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const userStorageKey = "@gofinances:user";

  async function signInWithGoogle(){
    try{
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      const {type, params} = await AuthSession.startAsync({authUrl}) as AuthorizationResponse;
      if(type === 'success'){
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();
        const userLoggedData = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          photo: userInfo.picture
        };
        setUser(userLoggedData);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLoggedData));
      }
    }catch (error){
      throw new Error(error);
    }
  }

  async function signInWithApple(){
    try{
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      });
      if(credential){
        const name = credential.fullName!.givenName!;
        const userLoggedData = {
          id: String(credential.user),
          email: credential.email!,
          name,
          photo: `https://ui-avatars.com/api/?name=${name}&length=1`
        };
        setUser(userLoggedData);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLoggedData));
      }
    }catch (error){
      throw new Error(error);

    }
  }

  async function singOut(){
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  }

  useEffect(() => {
    async function loadUserStorageData(){
      const userStored = await AsyncStorage.getItem(userStorageKey);
      if(userStored){
        const userLogged = JSON.parse(userStored) as User;
        setUser(userLogged);
      }
      setIsUserLoading(false);
    }
    loadUserStorageData();
  },[])
  return(
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      signInWithApple,
      singOut,
      isUserLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(){
  return  useContext(AuthContext);
}

export {AuthProvider, useAuth}
