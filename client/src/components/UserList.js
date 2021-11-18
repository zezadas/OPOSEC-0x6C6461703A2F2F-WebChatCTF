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
        var style = { 
            backgroundColor: "white",
            padding: "5px", 
            borderBottom: "2px solid gray", 
            borderTop: "2px solid gray" 
        }
        if (users) {
            users.forEach((privateKey, nick) => {
                listElm.push(<li key={nick} 
                    style={style}>{nick}</li>)
            })
        } else {
            style.color = "gray";
            listElm.push(<li key="random" style={style}>Fetching user list ...</li>)
        }
        return <ul style={{ listStyleType: "none", backgroundColor: "#d3e7e8", marginLeft: "auto", marginRight: "auto", textAlign: "center", boxShadow: "1px 2px 10px 2px" }}>
            <p style={{ marginTop: "20px", marginBottom: "5px", fontWeight: "bold" }}>Active Users</p>
            {
                listElm
            }
        </ul>;
    }
}

export default UserList;