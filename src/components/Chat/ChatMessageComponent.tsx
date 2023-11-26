import {Avatar, Message} from "@chatscope/chat-ui-kit-react";
import TimeAgo from "react-timeago";
import React from "react";
import Linkify from "react-linkify";

const ChatMessageComponent = ({ message, address }) => {
    return <Message model={{
        message: message.text ? message.text?.replace(/(^"|"$)/gm, '') : null,
        sender: message.twitterName,
        direction: message.sendingUserId === address?.toLowerCase() ? "outgoing" : "incoming",
        // position: message.sendingUserId === currentRoom.chatRoomId  ? "single" : "top"
        position: "single"
    }}>
        <Avatar src={message.twitterPfpUrl} name={message.twitterName}/>
        <Message.Footer style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '10px'
        }}><small>{message.twitterName} · {(new Date(message.timestamp)).toLocaleString()}</small></Message.Footer>
        {message.replyingToMessage?.messageId ?
            <Message.Header>
                <Message model={{
                    // direction: message.sendingUserId === address?.toLowerCase() ? 'incoming' : 'outgoing',
                    message: message.replyingToMessage.text ? message.replyingToMessage
                            .text
                            .replace(/(^"|"$)/gm, '')
                            .replace(/\\n/g, '\n')
                            .replace(/\\"/g, '"') :
                        null
                    ,
                    direction: "incoming",
                    position: "last",
                    sender: message.replyingToMessage.twitterName,
                }}>

                    <Message.Header style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        Replying to
                        <Avatar src={message.replyingToMessage.twitterPfpUrl}
                                size='sm'
                                name={message.replyingToMessage.twitterName}/>
                        {message.replyingToMessage.twitterName} · {(new Date(message.replyingToMessage.timestamp)).toLocaleString()}
                    </Message.Header>
                </Message>
            </Message.Header>
            : null}
        <Message.CustomContent>
            <Linkify componentDecorator={(decoratedHref, decoratedText, key) => <a
                target="_blank" rel="noopener" href={decoratedHref} key={key}>
                {decoratedText}
            </a>}>
                {message?.text?.replace(/(^"|"$)/gm, '')
                    .replace(/\\n/g, '\n')
                    .replace(/\"/g, '"')}
            </Linkify>
        </Message.CustomContent>
        {message.imageUrls.map((url: string) => <Message.ImageContent src={url} alt="Image"
                                                                      width={300}/>)}
    </Message>
}


export default ChatMessageComponent;
