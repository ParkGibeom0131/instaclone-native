import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import * as MediaLibrary from 'expo-media-library';
import { FlatList } from "react-native-gesture-handler";
import { Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../colors";
import { StatusBar } from "expo-status-bar";

const Container = styled.View`
    flex: 1;
    background-color: black;
`;

const Top = styled.View`
    flex: 1
    background-color: black;
`;

const Bottom = styled.View`
    flex: 1
    background-color: black;
`;

const ImageContainer = styled.TouchableOpacity`
`;

const IconContainer = styled.View`
    position: absolute;
    bottom: 5px;
    right: 0px;
`;

const HeaderRightText = styled.Text`
    color: ${colors.blue};
    font-size: 16px
    font-weight: 600;
    margin-right: 15px;
`;

export default function SelectPhoto({ navigation }) {
    const [ok, setOk] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [chosenPhoto, setChosenPhoto] = useState("");
    const [photoLocal, setPhotoLocal] = useState("");
    const getPhotos = async () => {
        const { assets: photos } = await MediaLibrary.getAssetsAsync();
        setPhotos(photos);
        setChosenPhoto(photos[0]?.uri);
    };
    const getPermissions = async () => {
        const { accessPrivileges, canAskAgain } = await MediaLibrary.getPermissionsAsync();
        // getPermissions를 통해 권한 부여 확인
        if (accessPrivileges === "none" && canAskAgain) {
            // user가 권한 거부 and 권한 요청 전, canAskAgain 또한 true인지 확인
            const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();
            // 권한 요청을 한 적이 없다면 권한 요청을 보냄
            if (accessPrivileges !== "none") {
                setOk(true);
                // 권한 요청을 수락할 경우 setOk 값을 true
                getPhotos();
            }
        } else if (accessPrivileges !== "none") {
            setOk(true);
            getPhotos();
        }
    };
    const HeaderRight = () => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate("UploadForm", {
                    photoLocal,
                })
            }
        >
            <HeaderRightText>Next</HeaderRightText>
        </TouchableOpacity>
    );
    useEffect(() => {
        getPermissions();
    }, []);
    useEffect(() => {
        navigation.setOptions({
            headerRight: HeaderRight,
        });
    }, [chosenPhoto, photoLocal]);
    const numColumns = 4;
    const { width } = useWindowDimensions();
    const choosePhoto = async (id) => {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(id);
        setPhotoLocal(assetInfo.localUri);
        setChosenPhoto(assetInfo.uri);
    };
    const renderItem = ({ item: photo }) => (
        <ImageContainer onPress={() => choosePhoto(photo.id)}>
            <Image
                source={{ uri: photo.uri }}
                style={{ width: width / numColumns, height: 100 }}
            />
            <IconContainer>
                <Ionicons name="checkmark-circle" size={18} color={photo.uri === chosenPhoto ? colors.blue : "white"} />
            </IconContainer>
        </ImageContainer>
    );
    return (
        <Container>
            <StatusBar hidden={false} />
            <Top>
                {chosenPhoto !== "" ? (
                    <Image
                        source={{ uri: chosenPhoto }}
                        style={{ width, height: "100%" }}
                    />
                ) : null}
            </Top>
            <Bottom>
                <FlatList
                    data={photos}
                    numColumns={numColumns}
                    keyExtractor={(photo) => photo.id}
                    renderItem={renderItem}
                />
            </Bottom>
        </Container>
    );
}