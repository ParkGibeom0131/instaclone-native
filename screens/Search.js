import React, { useEffect } from "react";
import { ActivityIndicator, Text, View, TextInput, useWindowDimensions, FlatList, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import { useForm } from "react-hook-form";
import { gql, useLazyQuery } from '@apollo/client';

const SEARCH_PHOTOS = gql`
    query searchPhotos($keyword: String!) {
        searchPhotos(keyword: $keyword) {
            id
            file
        }
    }
`;

const MessageContainer = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
`;

const MessageText = styled.Text`
    margin-top: 15px;
    color: white;
    font-weight: 600;
`;

const Input = styled.TextInput`
    background-color: rgba(255, 255, 255, 1);
    color: black;
    width: ${(props) => props.width / 1.5}px;
    padding: 5px 10px;
    border-radius: 7px;
`;

export default function Search({ navigation }) {
    const numColumns = 4;
    const { width } = useWindowDimensions();
    const { setValue, register, watch, handleSubmit } = useForm();
    const [startQueryFn, { loading, data, called }] = useLazyQuery(SEARCH_PHOTOS);
    const onValid = ({ keyword }) => {
        startQueryFn({
            variables: {
                keyword
            },
        });
    };
    // useQuery는 component가 mount될 때 바로 실행됨, 
    // 원할 때 skip할 수 있지만 원하는 대로 모든 것을 제어할 수는 없음
    // 보통 return 타입은 object => data, loading 등

    // LazyQuery는 바로 실행되지 않는 query, 실행을 원할 때 실행할 수 있는 query
    // useLazyQuery의 경우 return 타입은 mutation 등과 비슷

    const SearchBox = () => (
        <Input
            width={width}
            placeholderTextColor="rgba(0, 0, 0, 0.8)"
            placeholder="Search Photos"
            autoCapitalize="none"
            returnKeyLabel="Search"
            returnKeyType="search"
            autoCorrect={false}
            onChangeText={(text) => setValue("keyword", text)}
            onSubmitEditing={handleSubmit(onValid)}
        />
    );
    useEffect(() => {
        navigation.setOptions({
            headerTitle: SearchBox,
        });
        register("keyword", {
            required: true,
            minLength: 3,
        });
    }, []);

    const renderItem = ({ item: photo }) => (
        // Search는 screen 이고, screen은 navigation object를 그냥 받아올 수 있음
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("Photo", {
                    photoId: photo.id,
                })
            }
        >
            <Image source={{ uri: photo.file }} style={{ width: width / numColumns, height: 100 }} />
        </TouchableOpacity>
    );
    return (
        <DismissKeyboard>
            <View style={{ flex: 1, backgroundColor: "black" }}>
                {loading ? (
                    // loading은 query를 실행하지 않았기 때문에 기본적으로 false
                    <MessageContainer>
                        <ActivityIndicator size="large" />
                        <MessageText>Searching...</MessageText>
                    </MessageContainer>
                ) : null}
                {!called ? (
                    <MessageContainer>
                        <MessageText>Search by keyword</MessageText>
                    </MessageContainer>
                ) : null}
                {data?.searchPhotos !== undefined ? (
                    data?.searchPhotos?.length === 0 ? (
                        <MessageContainer>
                            <MessageText>Could not find anything</MessageText>
                        </MessageContainer>
                    ) : <FlatList
                        numColumns={numColumns}
                        data={data?.searchPhotos}
                        keyExtractor={(photo) => "" + photo.id}
                        renderItem={renderItem}
                    />
                ) : null}
            </View>
        </DismissKeyboard>
    );
}