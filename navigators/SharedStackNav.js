import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Profile from '../screens/Profile';
import Photo from "../screens/Photo";
import Feed from '../screens/Feed';
import Search from '../screens/Search';
import Notifications from '../screens/Notifications';
import Me from '../screens/Me';
import { Image } from "react-native";
import Likes from './../screens/Likes';
import Comments from './../screens/Comments';

const Stack = createStackNavigator();

export default function SharedStackNav({ screenName }) {
    return (
        <Stack.Navigator
            headerMode="screen"
            screenOptions={{
                headerBackTitleVisible: false,
                headerTintColor: "white",
                headerStyle: {
                    shadowColor: "rgba(255,255,255,0.5)",
                    backgroundColor: "black",
                },
            }}
        >
            {screenName === "Feed" ? (
                <Stack.Screen
                    name={"Feed"}
                    component={Feed}
                    options={{
                        headerTitle: () => (
                            <Image
                                style={{
                                    maxWidth: 100,
                                }}
                                resizeMode="contain"
                                source={require("../assets/logo.png")}
                            />
                        ),
                    }}
                />
            ) : null}
            {screenName === "Search" ? <Stack.Screen name={"Search"} component={Search} /> : null}
            {screenName === "Notifications" ? <Stack.Screen name={"Notifications"} component={Notifications} /> : null}
            {screenName === "Me" ? <Stack.Screen name={"Me"} component={Me} /> : null}
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Photo" component={Photo} />
            <Stack.Screen name="Likes" component={Likes} />
            <Stack.Screen name="Comments" component={Comments} />
        </Stack.Navigator>
    );
}

// 현재 shared 화면은 Profile과 Photo, Likes 세 개

// 두 화면은 StackNavFactory의 모든 return 값들을 공유하고 있음

// 똑같은 navigator에서 각각 다른 결과물을 렌더링하는 stack navigator를 만든 이유

// Search 탭에 있을 때, Photo로 갈 수도 있고 stack navigator 상에서 왔다갔다 가능함

// 이와 같은 구성은 헤더 때문인데, 탭 안에 있는 navigation을 이용해서
// 여기저기 옮겨다닐 수 있도록 하기 위함

// Feed에서 사진을 보고, 사진을 올린 사용자의 이름을
// 눌러 사용자의 프로필로 이동할 수 있으며, 프로필에서 사용자의 사진을 볼 수 있음


