import React from 'react';

import 'babel-polyfill';

class UserList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeUsers: props.activeUsers,
        };
        this.myRef= React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (this.props.activeUsers != null &&
            (
                prevProps.activeUsers == null || 
                prevProps.activeUsers.length !== this.props.activeUsers.length)
            ) {
                this.setState({ activeUsers: this.props.activeUsers })
        }
    }

    render() {
        var users = this.state.activeUsers;
        var listElm = []
        if (users) {
            users.forEach((privateKey, nick) => {
                listElm.push(<li>{nick}</li>)
            })
        }
        return <ul>
            {
                listElm
            }
        </ul>;
    }
}

export default UserList;