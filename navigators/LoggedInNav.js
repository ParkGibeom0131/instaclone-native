import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabsNav from "./TabsNav";
import UploadNav from "./UploadNav";
import UploadForm from "../screens/UploadForm";
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();

export default function LoggedInNav() {
    return (
        <Stack.Navigator screenOptions={{ presentation: "modal" }}>
            <Stack.Screen
                name="Tabs"
                options={{ headerShown: false }}
                component={TabsNav}
            />
            <Stack.Screen
                name="Upload"
                options={{ headerShown: false }}
                component={UploadNav}
            />
            <Stack.Screen
                name="UploadForm"
                options={{
                    title: "Upload",
                    headerTintColor: "white",
                    headerBackImage: ({ tintColor }) => (<Ionicons color={tintColor} name="close" size={28} />),
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: "black",
                    },
                }}
                component={UploadForm}
            />
        </Stack.Navigator >
    );
}