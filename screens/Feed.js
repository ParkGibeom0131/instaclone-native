import { gql, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Photo from "../components/Photo";
import ScreenLayout from "../components/ScreenLayout";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";

const FEED_QUERY = gql`
    query seeFeed($offset: Int!) {
        seeFeed(offset: $offset) {
            ...PhotoFragment
            user {
                id
                username
                avatar
            }
            caption
            comments {
                ...CommentFragment
            }
            createdAt
            isMine
        }
    }
    ${PHOTO_FRAGMENT}
    ${COMMENT_FRAGMENT}
`;
// ScrollView
// React Native에서 스크롤이 필요할 때 사용할 수 있음
// ScrollView는 모든 react 자식 컴포넌트를 한 번에 렌더링하기 때문에 성능이 저하될 수 있음
// 표시하려는 항목의 목록이 매우 많을 때 사용하지도 않을 모든 리스트에 대한 JS 컴포넌트와 
// 기본 뷰를 한 번에 생성하면 렌더링 속도가 느려지고 메모리 사용량이 증가함

// FlatList
// 기본 플랫 목록을 렌더링하기 위한 고성능 인터페이스
// FlatList는 많은 데이터를 스크롤을 통해 보여줄 때 사용
// FlatList는 항목, 여러 열, 무한 스크롤 로딩 등을 렌더링하려는 경우에 유용
// 자바스크립트의 map 함수와 비슷한 역할을 함

export default function Feed({ navigation }) {
    const { data, loading, refetch, fetchMore } = useQuery(FEED_QUERY, {
        variables: {
            offset: 0,
        },
    });
    const renderPhoto = ({ item: photo }) => {
        return <Photo {...photo} />;
    };
    const refresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };
    const [refreshing, setRefreshing] = useState(false);
    // Pull to Refresh
    return (
        <ScreenLayout loading={loading}>
            <FlatList
                onEndReachedThreshold={0.02}
                onEndReached={() =>
                    fetchMore({
                        variables: {
                            offset: data?.seeFeed?.length,
                        },
                    })
                }
                refreshing={refreshing}
                onRefresh={refresh}
                style={{ width: "100%" }}
                showsVerticalScrollIndicator={false}
                data={data?.seeFeed}
                keyExtractor={(photo) => "" + photo.id}
                renderItem={renderPhoto}
            />
        </ScreenLayout>
    );
}

// onEndReached는 리스트의 끝에 도달했을 때 호출되는 function
// onEndReachedThreshold를 이용하여 끝에 도달하는 지점을 설정 가능