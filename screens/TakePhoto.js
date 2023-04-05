import { Camera } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import Slider from "@react-native-community/slider";
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import * as MediaLibrary from 'expo-media-library';
import { useIsFocused } from "@react-navigation/native";

const Container = styled.View`
    flex: 1;
    background-color: black;
`;

const Actions = styled.View`
    flex: 0.35;
    padding: 0px 50px;
    align-items: center;
    justify-content: space-around;
`;

const TakePhotoBtn = styled.TouchableOpacity`
    width: 100px;
    height: 100px;
    background-color: rgba(255, 255, 255, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.8)
    border-radius: 50px;
    opacity: 0.8;
`;

const SliderContainer = styled.View``;
const ButtonsContainer = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const ActionsContainer = styled.View`
    flex-direction: row;
`;

const CloseButton = styled.TouchableOpacity`
    position: absolute;
    top: 20px;
    left: 20px;
`;

const PhotoActions = styled(Actions)`
    flex-direction: row;
`;

const PhotoAction = styled.TouchableOpacity`
    background-color: white;
    padding: 10px 25px;
    border-radius: 4px;
`;
const PhotoActionText = styled.Text`
    font-weight: 600;
`;

export default function TakePhoto({ navigation }) {
    const camera = useRef();
    const [takenPhoto, setTakenPhoto] = useState("");
    const [cameraReady, setCameraReady] = useState(false);
    const [ok, setOk] = useState(false);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.auto);
    const [zoom, setZoom] = useState(0);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
    const getPermissions = async () => {
        const { granted } = await Camera.requestCameraPermissionsAsync();
        setOk(granted);
    }
    useEffect(() => {
        getPermissions();
    }, []);
    const onCameraSwitch = () => {
        if (cameraType === Camera.Constants.Type.front) {
            setCameraType(Camera.Constants.Type.back);
        } else {
            setCameraType(Camera.Constants.Type.front);
        }
    }
    const onZoomValueChange = (e) => {
        setZoom(e);
    };
    const onFlashChange = () => {
        if (flashMode === Camera.Constants.FlashMode.off) {
            // on
            setFlashMode(Camera.Constants.FlashMode.on);
        } else if (flashMode === Camera.Constants.FlashMode.on) {
            // auto
            setFlashMode(Camera.Constants.FlashMode.auto);
        } else if (flashMode === Camera.Constants.FlashMode.auto) {
            // off
            setFlashMode(Camera.Constants.FlashMode.off);
        }
    };
    const onCameraReady = () => setCameraReady(true);
    const takePhoto = async () => {
        if (camera.current && cameraReady) {
            // 카메라가 존재하는지, 카메라가 촬영 준비를 끝냈는지
            const { uri } = await camera.current.takePictureAsync({
                quality: 1,
                // 0 ~ 1 사잇값
                exif: true,
                // 메타데이터
            });
            // const asset = await MediaLibrary.createAssetAsync(uri);
            // 사진을 기기에 저장
            setTakenPhoto(uri);
        }
    };
    const onDismiss = () => setTakenPhoto("");
    const goToUpload = async (save) => {
        if (save) {
            await MediaLibrary.saveToLibraryAsync(takenPhoto);
            // saveToLibraryAsync는 return 값이 없음, 캐시로부터 사진을 업로드
        }
        navigation.navigate("UploadForm", {
            file: takenPhoto,
        });
    };
    const onUpload = () => {
        Alert.alert("Save photo?", "Save photo & upload or just upload", [
            {
                text: "Save & Upload",
                onPress: () => goToUpload(true),
            },
            {
                text: "Just Upload",
                onPress: () => goToUpload(false),
            },
        ]);
    };
    const isFocused = useIsFocused();
    return (
        <Container>
            {isFocused ? <StatusBar hidden={true} /> : null}
            {takenPhoto === "" ? (<Camera
                type={cameraType}
                style={{ flex: 1 }}
                zoom={zoom}
                flashMode={flashMode}
                ref={camera}
                onCameraReady={onCameraReady}
            >
                <CloseButton onPress={() => navigation.navigate("Tabs")}>
                    <Ionicons name="close" color="white" size={30} />
                </CloseButton>
            </Camera>
            ) : (
                <Image source={{ uri: takenPhoto }} style={{ flex: 1 }} />
            )}
            {takenPhoto === "" ? (
                <Actions>
                    <SliderContainer>
                        <Slider
                            style={{ width: 200, height: 40 }}
                            minimumValue={0}
                            maximumValue={1}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#rgba(255, 255, 255, 0.5)"
                            onValueChange={onZoomValueChange}
                        />
                    </SliderContainer>
                    <ButtonsContainer>
                        <TakePhotoBtn onPress={takePhoto} />
                        <ActionsContainer>
                            <TouchableOpacity onPress={onFlashChange} style={{ marginRight: 30 }}>
                                <Ionicons
                                    size={30}
                                    color="white"
                                    name={
                                        flashMode === Camera.Constants.FlashMode.off
                                            ? "flash-off"
                                            : flashMode === Camera.Constants.FlashMode.on
                                                ? "flash"
                                                : flashMode === Camera.Constants.FlashMode.auto
                                                    ? "eye"
                                                    : ""
                                    }
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onCameraSwitch}>
                                <Ionicons
                                    size={30}
                                    color="white"
                                    name={
                                        cameraType === Camera.Constants.Type.front
                                            ? "camera-reverse"
                                            : "camera"
                                    }
                                />
                            </TouchableOpacity>
                        </ActionsContainer>
                    </ButtonsContainer>
                </Actions>
            ) : (
                <PhotoActions>
                    <PhotoAction onPress={onDismiss}>
                        <PhotoActionText>Dismiss</PhotoActionText>
                    </PhotoAction>
                    <PhotoAction onPress={onUpload}>
                        <PhotoActionText>Upload</PhotoActionText>
                    </PhotoAction>
                </PhotoActions>
            )}
        </Container>
    );
}