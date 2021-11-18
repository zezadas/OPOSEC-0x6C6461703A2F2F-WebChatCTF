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
                listElm.push(<li style={{ padding: "5px" }}>{nick}</li>)
            })
        }
        return <ul style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
            <p style={{ marginTop: "30px", fontWeight: "strong" }}>Active Users</p>
            {
                listElm
            }
        </ul>;
    }
}

export default UserList;