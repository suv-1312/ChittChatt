import React, { useState } from 'react'
import { Avatar, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tooltip, Box, Text, useToast, useDisclosure, Spinner } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import ProfileModal from './ProfileModal';
import { ChatState } from '../../Context/ChatProvider';
import { useNavigate } from "react-router";
import axios from "axios";
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvtar/UserListItem';
import { getSender } from '../../config/ChatLogic';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

const SideDrawer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();


    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    // console.log(user);


    const history = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history("/");
    }

    const notificationHandler = (notif) => {
        setSelectedChat(notif.chat);
        setNotification(notification.filter((n) => n !== notif));
    }

    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };


    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("http://localhost:5000/api/chat", { userId }, config);

            if (!chats.find((c) => c.id === data._id))
                setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: "Error fetching the Chat",
                description: error.message,
                status: error,
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    };


    return (
        <div>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i class="fas fa-search"></i>
                        <Text display={{ base: "none", md: "flex" }} px="4">
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans">
                    Chit-Chat
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList pl="2">
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => notificationHandler(notif)}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Log out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>


            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

                    <DrawerBody>
                        <Box display='flex' pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={4}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (<ChatLoading />) :
                            (
                                searchResult?.map(user => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}

                                    />
                                ))
                            )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SideDrawer

