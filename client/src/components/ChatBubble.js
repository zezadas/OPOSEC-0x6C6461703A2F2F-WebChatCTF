import React from 'react';
import PropTypes from 'prop-types';

class ChatBubble extends React.Component {
    render() {
        const {
            bgColor,
            color,
            maxWidth,
            children,
        } = this.props;

        return (
            <div className='chat-bubble' style={{ backgroundColor: bgColor,  color: color, maxWidth: maxWidth }}>
                {children}
            </div>
        );
    }
}

ChatBubble.propTypes = {
    children: PropTypes.node
}

export default ChatBubble;
