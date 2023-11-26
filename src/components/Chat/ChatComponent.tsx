import React, {useState, useEffect, useCallback} from "react";
import {
    ChatContainer,
    MainContainer,
    Sidebar,
    ConversationList,
    Conversation,
    MessageList,
    Avatar,
    ConversationHeader,
    InfoButton,
    Search, MessageInput,
} from "@chatscope/chat-ui-kit-react";
import {useSocket} from "../Socket/SocketProvider";
import {useAddress} from "@thirdweb-dev/react";
import TimeAgo from "react-timeago";
import {Settings} from "@mui/icons-material";
import ChatSettingsComponent from "./ChatSettingsComponent";
import {useSnackbar} from "notistack";
import ChatMessageComponent from "./ChatMessageComponent";
import {Box, Button} from "@mui/material";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./dark.scss";
import "./chat.css";

const ChatComponent = ({currentTheme}) => {
    const socket = useSocket();
    const address = useAddress();
    const {enqueueSnackbar} = useSnackbar();

    const [owner, setOwner] = useState(null);

    const [rooms, setRooms] = useState([]);
    const [roomLastActive, serRoomLastActive] = useState<any>({});
    const [currentRoom, setCurrentRoom] = useState<any>({chatRoomId: null});
    const [currentRoomLastOnline, setCurrentRoomLastOnline] = useState<string>('');
    const [roomsLoading, setRoomsLoading] = useState(true);

    const [messageInputValue, setMessageInputValue] = useState("");

    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [messagesLoadMore, setMessagesLoadMore] = useState(false);
    const [messagesNextPageStart, setMessagesNextPageStart] = useState(0);

    const [wallMessages, setWallMessages] = useState([]);
    const [wallMessagesSearch, setWallMessagesSearch] = useState("");
    const [wallMessagesLoadMore, setWallMessagesLoadMore] = useState(false);

    const [config, setConfig] = useState<any>({});
    const [configError, setConfigError] = useState<any>({});
    const [ftToken, setFtToken] = useState<any>(null);

    const [initialized, setInitialized] = useState(false);
    // useEffect(() => {
    //     if (currentTheme?.palette?.mode === "dark") {
    //         // Require the dark theme SCSS or CSS
    //         require("./dark.scss");
    //     }
    //     // You could also unload the dark theme here if needed
    //     // or have a different theme file for 'light' mode.
    // }, [currentTheme]);
    useEffect(() => {
        if (!address) return;
        if (!ftToken) return;
        loadRooms(true);
    }, [address, ftToken]);
    useEffect(() => {
        if (currentRoom.chatRoomId === null) return;
        if (!address) return;
        if (!ftToken) return;
        if (currentRoom.chatRoomId === 'my-wall') {
            loadWallMessages(true);
        } else {
            loadMessages(true);
        }
    }, [currentRoom, ftToken]);
    useEffect(() => {
        if (!socket) return;
        if (!address) return;

        if (socket) {
            // @ts-ignore
            socket.on('message', (data) => {
                data = typeof data === 'string' ? JSON.parse(data) : data;
                console.log('message', data);
                switch (data.method) {
                    case 'chatGetConfigSuccess':
                        setConfig(data.payload);
                        if (data.payload.jwt && !initialized) {
                            setCurrentRoom({chatRoomId: 'my-wall'});
                        }
                        setInitialized(true);
                        break;
                    case 'chatUpdateConfigSuccess':
                        setConfig(data.payload);
                        enqueueSnackbar('Chat configuration saved successfully.', {variant: 'success'});
                        break;
                    case 'chatUpdateConfigError':
                        setConfigError(data.payload);
                        break;
                    case 'chatMessageReceived':
                        loadRooms(false);
                        if (data.payload.chatRoomId === currentRoom.chatRoomId) {
                            // @ts-ignore
                            setMessages(prev => [...prev, data.payload]);
                        }
                        // @ts-ignore
                        setWallMessages(prev => [...prev, data.payload]);
                        break;
                    case 'chatBroadcastMessageSuccess':
                        enqueueSnackbar('Broadcast message sent successfully.', {variant: 'success'});
                        break;
                    case 'wallGetMessagesSuccess':
                        updateWallMessages(data.payload.messages, data.payload.params);
                        setMessagesLoading(false);
                        break;
                    case 'chatSetMessageWarning':
                        if (data.payload.sent === 0) {
                            enqueueSnackbar('Error while sending message', {variant: 'error'});
                        } else {
                            enqueueSnackbar(`${data.payload.sent}/${data.payload.total} messages sent`, {variant: 'warning'});
                        }
                        break;
                }
            });
        }

        sendMessage('init');
        sendMessage('chatGetConfig');

        return () => {
            if (socket) {
                // @ts-ignore
                socket.off('message');
            }
        };
    }, [socket, address, currentRoom, initialized]);
    useEffect(() => {
        if (config.jwt) {
            setFtToken(config.jwt);
        }
    }, [config]);
    // Opóźnienie wyszukiwania
    useEffect(() => {
        setWallMessages([]);
    }, [wallMessagesSearch]);
    useEffect(() => {
        if (wallMessages.length === 0) {
            sendMessage('wallGetMessages', {
                // @ts-ignore
                query: wallMessagesSearch,
            });
        }
    }, [
        wallMessages, wallMessagesSearch
    ]);
    // useEffect(() => {
    //     if (!address) return;
    //     if (!ftToken) return;
    //     const _ = async () => {
    //         const url = `https://prod-api.kosetto.com/messages/${address.toLowerCase()}`
    //         const response = await fetch(url, {
    //             headers: {
    //                 'Authorization': `${ftToken}`,
    //                 'Origin': 'https://www.friend.tech',
    //                 'Referer': 'https://www.friend.tech/',
    //             }
    //         });
    //         const data = await response.json();
    //         data.messages.reverse();
    //         setMessages(data.messages);
    //         setMessagesLoading(false);
    //     }
    //     _();
    // }, [address, ftToken]);

    const formatter = useCallback((value, unit, suffix) => `${value}${unit[0]}`, []);
    const getStatus = useCallback((time) => {
        const now = Date.now();
        if (now - time < 1000 * 60 * 5) {
            return 'available';
        }
        return 'dnd';
    }, []);
    const loadRooms = useCallback(async (preloader: boolean = false) => {
        if (!address) return;
        if (!ftToken) return;
        if (preloader) setRoomsLoading(true);
        try {
            let url = `https://prod-api.kosetto.com/self-chat/${address.toLowerCase()}`;
            let response = await fetch(url, {
                headers: {
                    'Authorization': `${ftToken}`,
                    'Origin': 'https://www.friend.tech',
                    'Referer': 'https://www.friend.tech/',
                }
            });
            let data = await response.json();
            let rooms = data.holdings;
            url = `https://prod-api.kosetto.com/portfolio/${address.toLowerCase()}`;
            response = await fetch(url, {
                headers: {
                    'Authorization': `${ftToken}`,
                    'Origin': 'https://www.friend.tech',
                    'Referer': 'https://www.friend.tech/',
                }
            });
            data = await response.json();
            rooms.push(...data.holdings);
            setRooms(rooms);
            rooms.forEach((room) => {
                if (room.chatRoomId === currentRoom.chatRoomId) {
                    setCurrentRoomLastOnline(room.lastOnline);
                }
            });
            setTimeout(() => {
                loadRooms();
            }, 20000);
        } catch (e) {
            console.log(e);
        }
        if (preloader) setRoomsLoading(false);
    }, [address, ftToken]);
    const loadMessages = useCallback(async (preloader: boolean = false, next: boolean = false) => {
        if (!address) return;
        if (!ftToken) return;
        if (currentRoom.chatRoomId === null || currentRoom.chatRoomId === 'my-wall') return;
        if (preloader) setMessagesLoading(true);
        const url = `https://prod-api.kosetto.com/messages/${currentRoom.chatRoomId}${next ? ('?pageStart='+ messagesNextPageStart) : ''}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `${ftToken}`,
                'Origin': 'https://www.friend.tech',
                'Referer': 'https://www.friend.tech/',
            }
        });
        const data = await response.json();
        try {
            data.messages.reverse();
        } catch (e) {
            return;
        }
        setMessagesLoadMore(data.messages.length >= 10);
        setMessagesNextPageStart(data.nextPageStart);
        setMessages(prev => next ? [...data.messages, ...prev] : data.messages);
        setMessagesLoading(false);
        if (preloader) setMessagesLoading(false);
    }, [address, currentRoom, ftToken, messagesNextPageStart]);
    const sendMessage = useCallback((method: string, payload: any = {}) => {
        if (socket && address) {
            // @ts-ignore
            socket.emit('message', {
                address: address.toLowerCase(),
                method,
                payload
            });
        }
    }, [socket, address]);
    const updateConfig = useCallback((config: any) => {
        if (socket && address) {
            // @ts-ignore
            sendMessage('chatUpdateConfig', config);
        }
    }, [socket, address]);
    const loadWallMessages = useCallback(async (preloader: boolean = false) => {
        sendMessage('wallGetMessages', {
            // @ts-ignore
            lastMessageId: wallMessages.length > 0 ? wallMessages[0]?.messageId : null,
            query: wallMessagesSearch,
        });
    }, [ftToken, wallMessages, wallMessagesSearch]);
    const updateWallMessages = (messages, params) => {
        setWallMessagesLoadMore(messages.length === 20);
        //@ts-ignore
        setWallMessages(prev => {

            // Łączenie starych i nowych wiadomości
            if (params?.lastMessageId) {
                messages = [
                    ...prev,
                    ...messages,
                ];
            }

            // Tworzenie mapy do przechowywania unikalnych wiadomości
            const uniqueMessagesMap = new Map();

            // Iterowanie po wiadomościach i przechowywanie unikalnych messageId
            messages.forEach(message => {
                uniqueMessagesMap.set(message.messageId, message);
            });

            // Konwersja mapy z powrotem na tablicę
            const uniqueMessages = Array.from(uniqueMessagesMap.values());

            // Sortowanie wiadomości
            uniqueMessages.sort((a, b) => {
                return parseInt(a.messageId) - parseInt(b.messageId);
            });

            // Ustawianie wynikowej tablicy jako nowej wartości wallMessages
            // @ts-ignore
            return uniqueMessages;
        })
    };

    const switchRoom = (room) => {
        setCurrentRoom(room);
        setCurrentRoomLastOnline(room.lastOnline);
    };

    /** Sidebar **/
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [sidebarStyle, setSidebarStyle] = useState({});
    const [chatContainerStyle, setChatContainerStyle] = useState({});
    const [conversationContentStyle, setConversationContentStyle] = useState({});
    const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});
    const handleBackClick = () => setSidebarVisible(!sidebarVisible);
    const handleConversationClick = useCallback(() => {
        if (sidebarVisible) {
            setSidebarVisible(false);
        }
    }, [sidebarVisible, setSidebarVisible]);
    useEffect(() => {
        if (sidebarVisible) {
            setSidebarStyle({
                display: "flex",
                flexBasis: "auto",
                width: "100%",
                maxWidth: "100%"
            });
            setConversationContentStyle({
                display: "flex"
            });
            setConversationAvatarStyle({
                marginRight: "1em"
            });
            setChatContainerStyle({
                display: "none"
            });
        } else {
            setSidebarStyle({});
            setConversationContentStyle({});
            setConversationAvatarStyle({});
            setChatContainerStyle({});
        }
    }, [sidebarVisible, setSidebarVisible, setConversationContentStyle, setConversationAvatarStyle, setSidebarStyle, setChatContainerStyle]);
    /** /Sidebar **/

    return (<div id='chat' className={currentTheme?.palette?.mode}>
            <MainContainer responsive>
                <Sidebar position="left" style={sidebarStyle}>
                    <ConversationList loading={roomsLoading && ftToken}>
                        <Conversation
                            active={currentRoom.chatRoomId === null}
                            onClick={() => {
                                if (sidebarVisible) {
                                    setSidebarVisible(false);
                                }
                                setCurrentRoom({chatRoomId: null})
                            }}
                        >
                            <Avatar style={conversationAvatarStyle}><Settings sx={{
                                width: '3rem',
                                height: '3rem'
                            }}/></Avatar>
                            <Conversation.Content
                                name="Settings"
                                info="Configure your chat"
                                key="configuration"
                                style={conversationContentStyle}
                            />
                        </Conversation>
                        {(rooms.length > 0 || currentRoom.chatRoomId === 'my-wall') ? (
                            <Conversation
                                onClick={() => {
                                    if (sidebarVisible) {
                                        setSidebarVisible(false);
                                    }
                                    setCurrentRoom({chatRoomId: 'my-wall'})
                                }}
                                active={currentRoom.chatRoomId === 'my-wall'}>
                                <Avatar style={conversationAvatarStyle}
                                        src='/images/chatbot.logo.png'></Avatar>
                                <Conversation.Content
                                    name="My Wall"
                                    info="Chatroom aggregator"
                                    key="my-wall"
                                    style={conversationContentStyle}
                                />
                            </Conversation>
                        ) : ''}
                        {rooms.map((room: any) => (
                            <Conversation
                                key={room.chatRoomId}
                                onClick={() => {
                                    if (sidebarVisible) {
                                        setSidebarVisible(false);
                                    }
                                    switchRoom(room)
                                }}
                                active={currentRoom.chatRoomId === room.chatRoomId}
                                lastActivityTime={<span style={{
                                    color: "teal"
                                }}><TimeAgo date={parseInt(room.lastMessageTime)} formatter={formatter}/></span>}
                            >
                                <Avatar style={conversationAvatarStyle}
                                        src={room.pfpUrl}
                                        name={room.name}
                                        status={getStatus(room.lastOnline)}
                                />
                                <Conversation.Content
                                    name={room.name}
                                    lastSenderName={room.lastMessageName !== room.name ? room.lastMessageName : null}
                                    info={room.lastMessageText ? room.lastMessageText?.replace(/(^"|"$)/gm, '') : null}
                                    style={conversationContentStyle}
                                />
                            </Conversation>
                        ))}
                    </ConversationList>
                </Sidebar>

                {currentRoom.chatRoomId === null ? (
                    <ChatContainer style={chatContainerStyle}>
                        <ConversationHeader>
                            <ConversationHeader.Back  onClick={handleBackClick}/>
                            <Avatar><Settings sx={{
                                width: '3rem',
                                height: '3rem'
                            }}/></Avatar>
                            <ConversationHeader.Content userName='Settings'/>
                        </ConversationHeader>
                        <MessageList>
                            <ChatSettingsComponent
                                config={config}
                                setConfig={config => sendMessage('chatUpdateConfig', config)}
                                configError={configError}
                                setConfigError={setConfigError}
                                sendBroadcastMessage={message => sendMessage('chatBroadcastMessage', {message})}
                            />
                        </MessageList>
                    </ChatContainer>
                ) : (currentRoom.chatRoomId === 'my-wall' ? (
                    <ChatContainer style={chatContainerStyle}>
                        <ConversationHeader>
                            <ConversationHeader.Back  onClick={handleBackClick} />
                            <Avatar src='/images/chatbot.logo.png'/>
                            <ConversationHeader.Content userName='My Wall'>
                                <Search
                                    placeholder="Search..."
                                    value={wallMessagesSearch}
                                    onChange={v => setWallMessagesSearch(v)}
                                    onClearClick={() => setWallMessagesSearch('')}
                                />
                            </ConversationHeader.Content>
                        </ConversationHeader>
                        <MessageList loading={messagesLoading}>
                            {wallMessagesLoadMore ? <Box sx={{textAlign: 'center', my: 2}}>
                                <Button
                                    size='small'
                                    variant='outlined'
                                    onClick={() => loadWallMessages()}
                                >Load more...</Button>
                            </Box> : ''}
                            {wallMessages.map((message: any) => (
                                <ChatMessageComponent
                                    message={message}
                                    address={address}
                                />
                            ))}
                        </MessageList>
                    </ChatContainer>
                ) : (
                    <ChatContainer style={chatContainerStyle}>
                        <ConversationHeader>
                            <ConversationHeader.Back  onClick={handleBackClick}/>
                            <Avatar src={currentRoom.pfpUrl} name={currentRoom.name}
                                    status={getStatus(parseInt(currentRoomLastOnline))}/>
                            <ConversationHeader.Content userName={currentRoom.name}
                                                        info={<span>Last seen <TimeAgo date={parseInt(currentRoomLastOnline)} /></span>}/>
                            <ConversationHeader.Actions>
                                <InfoButton/>
                            </ConversationHeader.Actions>
                        </ConversationHeader>
                        <MessageList loading={messagesLoading}>
                            {messagesLoadMore ? <Box sx={{textAlign: 'center', my: 2}}>
                                <Button
                                    size='small'
                                    variant='outlined'
                                    onClick={() => loadMessages(true, true)}
                                >Load more...</Button>
                            </Box> : ''}
                            {messages.map((message: any) => (
                                <ChatMessageComponent
                                    message={message}
                                    address={address}
                                />
                            ))}
                            {/*<MessageSeparator content="Saturday, 30 November 2019"/>*/}

                            {/*<Message model={{*/}
                            {/*    message: "Hello my friend",*/}
                            {/*    sentTime: "15 mins ago",*/}
                            {/*    sender: "Zoe",*/}
                            {/*    direction: "incoming",*/}
                            {/*    position: "single"*/}
                            {/*}}>*/}
                            {/*    <Avatar src={zoeIco} name="Zoe"/>*/}
                            {/*</Message>*/}

                        </MessageList>
                        <MessageInput
                            attachButton={false}
                            placeholder="Write something..."
                            value={messageInputValue}
                            onChange={val => setMessageInputValue(val)}
                            onSend={() => {
                                if (messageInputValue) {
                                    sendMessage('chatSetMessage', {
                                        messages: [{
                                            chatRoomId: currentRoom.chatRoomId,
                                            text: messageInputValue
                                        }]
                                    });
                                }
                                setMessageInputValue('');
                            }}
                        />
                    </ChatContainer>
                ))}

                {/*<Sidebar position="right">*/}
                {/*    <ExpansionPanel title="DETAILS">*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*    </ExpansionPanel>*/}
                {/*    <ExpansionPanel title="HOLDERS">*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*    </ExpansionPanel>*/}
                {/*    <ExpansionPanel title="HOLDING">*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*    </ExpansionPanel>*/}
                {/*    <ExpansionPanel title="TRADES">*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*        <p>Lorem ipsum</p>*/}
                {/*    </ExpansionPanel>*/}
                {/*</Sidebar>*/}
            </MainContainer>
        </div>
    )
        ;
};

export default ChatComponent;
