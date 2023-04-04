import React from "react";
import styled from 'styled-components/native';
import { colors } from './../colors';
import { useNavigation } from "@react-navigation/native";

const Column = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
`;
const Avatar = styled.Image`
    width: 40px;
    height: 40px;
    border-radius: 25px;
    margin-right: 10px;
`;
const Username = styled.Text`
    font-weight: 600;
    color: white;
`;
const Wrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
`;
const FollowBtn = styled.TouchableOpacity`
    background-color: ${colors.blue};
    justify-content: center;
    padding: 5px 10px;
    border-radius: 4px;
`;
const FollowBtnText = styled.Text`
    color: white;
    font-weight: 600;
`;


export default function UserRow({ avatar, id, username, isFollowing, isMe }) {
    const navigation = useNavigation();
    return (
        <Wrapper>
            <Column onPress={() => navigation.navigate("Profile", {
                id,
                username,
            })}>
                <Avatar source={{ uri: avatar }} />
                <Username>{username}</Username>
            </Column>
            {!isMe ? (
                <FollowBtn>
                    <FollowBtnText>{isFollowing ? "Unfollow" : "Follow"}</FollowBtnText>
                </FollowBtn>
            ) : null}
        </Wrapper>
    );
}