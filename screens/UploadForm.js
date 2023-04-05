import React, { useEffect } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import { useForm } from "react-hook-form";
import { colors } from "../colors";
import { gql, useMutation } from "@apollo/client";
import { FEED_PHOTO } from "../fragments";
import { ReactNativeFile } from "apollo-upload-client";

const UPLOAD_PHOTO_MUTATION = gql`
    mutation uploadPhoto($file: Upload!, $caption: String) {
        uploadPhoto(file: $file, caption: $caption) {
            ...FeedPhoto
        }
    }
    ${FEED_PHOTO}
`;

const Container = styled.View`
    flex: 1;
    background-color: black;
    padding: 0px 50px;
`;
const Photo = styled.Image`
    height: 250px;
`;
const CaptionContainer = styled.View`
    margin-top: 30px;
`;
const Caption = styled.TextInput`
    background-color: white;
    color: black;
    padding: 10px 20px;
    border-radius: 100px;
`;
const HeaderRightText = styled.Text`
    color: ${colors.blue};
    font-size: 16px
    font-weight: 600;
    margin-right: 15px;
`;

export default function UploadForm({ route, navigation }) {
    const updateUploadPhoto = (cache, result) => {
        const { data: { uploadPhoto } } = result;
        if (uploadPhoto.id) {
            cache.modify({
                id: "ROOT_QUERY",
                fields: {
                    seeFeed(prev) {
                        // seeFeed에 page나 offset을 저장하지 않음
                        return [uploadPhoto, ...prev];
                    }
                },
            });
            navigation.navigate("Tabs");
        }
    };
    const [uploadPhotoMutation, { loading }] = useMutation(UPLOAD_PHOTO_MUTATION, {
        update: updateUploadPhoto
    });
    const HeaderRight = () => (
        <TouchableOpacity
            onPress={handleSubmit(onValid)}
        >
            <HeaderRightText>Next</HeaderRightText>
        </TouchableOpacity>
    );
    const HeaderRightLoading = () => (
        <ActivityIndicator
            size="small"
            color="white"
            style={{ marginRight: 10 }}
        />
    );
    const { register, handleSubmit, setValue } = useForm();
    useEffect(() => {
        register("caption")
    }, [register]);
    useEffect(() => {
        navigation.setOptions({
            headerRight: loading ? HeaderRightLoading : HeaderRight,
            ...(loading && { headerLeft: () => null }),
            // loading 중이면 headerLeft가 null을 return
        });
    }, [loading]);
    // loading이 바뀔 때마다 헤더가 바뀜
    const onValid = ({ caption }) => {
        const file = new ReactNativeFile({
            uri: route.params.photoLocal,
            name: `1.jpg`,
            type: "image/jpeg",
        });
        uploadPhotoMutation({
            variables: {
                caption,
                file
            },
        });
    };
    return (
        <DismissKeyboard>
            <Container>
                <Photo resizeMode="contain" source={{ uri: route.params.photoLocal }} />
                <CaptionContainer>
                    <Caption
                        returnKeyType="done"
                        placeholder="Write a caption..."
                        placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        onSubmitEditing={handleSubmit(onValid)}
                        onChangeText={(text) => setValue("caption", text)}
                    />
                </CaptionContainer>
            </Container>
        </DismissKeyboard>
    );
}