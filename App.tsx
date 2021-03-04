import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
//@ts-ignore
import awsconfig from "./src/aws-exports";
//@ts-ignore
import { withAuthenticator } from "aws-amplify-react-native";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { getUser } from "./src/graphql/queries";
import { useEffect } from "react";
import { createUser } from "./src/graphql/mutations";
import { UserType } from "./types";
import axios from "axios";
import { useState } from "react";
import { useContext } from "react";

Amplify.configure(awsconfig);

//Auth Interface
interface AuthContextInterface {
  Currentuser: UserType;
}

//AuthContext
export const AuthCtx = React.createContext<AuthContextInterface | null>(null);

const CtxProvider: React.FC = (props) => {
  const [user, setUser] = useState(null);

  const saveUserToDB = async (user: UserType) => {
    await API.graphql(graphqlOperation(createUser, { input: user }));
  };

  useEffect(() => {
    const updateUser = async () => {
      // Get current authenticated user
      const userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });

      if (userInfo) {
        // Check if user already exists in database

        const userData = await API.graphql(
          graphqlOperation(getUser, { id: userInfo.attributes.sub })
        );
        console.log(userData);
        if (!userData.data.getUser) {
          const Newuser = {
            id: userInfo.attributes.sub,
            username: userInfo.username,
            name: userInfo.username,
            email: userInfo.attributes.email,
            image: (
              await axios.get("https://source.unsplash.com/random/800x450")
            ).request.responseURL,
          };
          await saveUserToDB(Newuser);
          setUser(Newuser);
        } else {
          console.log("User already exists");
          setUser(userData.data.getUser);
        }
      }

      // If it doesn't, create the user in the database
    };
    updateUser();
  }, []);

  return (
    <AuthCtx.Provider value={{ Currentuser: user ? user : null }}>
      {props.children}
    </AuthCtx.Provider>
  );
};

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <CtxProvider>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </CtxProvider>
    );
  }
}

export default withAuthenticator(App);
