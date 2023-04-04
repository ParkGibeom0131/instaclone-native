import React, { useState } from "react";
import { Text, View } from "react-native";
import { gql, useQuery } from '@apollo/client';
import { USER_FRAGMENT } from './../fragments';
import ScreenLayout from "../components/ScreenLayout";
import { FlatList } from "react-native-gesture-handler";
import UserRow from "../components/UserRow";

const LIKES_QUERY = gql`
    query seePhotoLikes($id: Int!) {
        seePhotoLikes(id: $id) {
            ...UserFragment
        }
    }
    ${USER_FRAGMENT}
`;

export default function Likes({ route }) {
    const [refreshing, setRefreshing] = useState(false);
    const { data, loading, refetch } = useQuery(LIKES_QUERY, {
        variables: {
            id: route?.params?.photoId
        },
        skip: !route?.params?.photoId,
        // Query를 건너뛰게 함
        // useQuery를 사용할 시점에 component가 렌더링 된 후 바로 skip
    });
    const renderUser = ({ item: user }) => (
        <UserRow {...user} />
    );
    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };
    return (
        <ScreenLayout loading={loading}>
            <FlatList
                ItemSeparatorComponent={() => (
                    <View
                        style={{
                            width: "100%",
                            height: 2,
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                        }}
                    />
                )}
                refreshing={refreshing}
                onRefresh={onRefresh}
                data={data?.seePhotoLikes}
                keyExtractor={(item) => "" + item.id}
                renderItem={renderUser}
                style={{ width: "100%" }}
            />
        </ScreenLayout>
    );
}