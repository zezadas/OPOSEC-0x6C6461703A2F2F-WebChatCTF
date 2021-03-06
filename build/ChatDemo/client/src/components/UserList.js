import React from 'react';

import 'babel-polyfill';

class UserList extends React.Component {

    constructor(props) {
        super(props);
        this.togglezadas = 0;
        this.state = {
            currentUser: props.currentUser,
            activeUsers: props.activeUsers,
            toggle: props.toggle
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.toggle > this.togglezadas){
            this.togglezadas=this.props.toggle;
            this.setState({ activeUsers: this.props.activeUsers});
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
                listElm.push(
                    <li key={nick} style={style}>
                        <button style={{ backgroundColor: "transparent", border: "none", textDecoration: "underline", cursor: "pointer" }} 
                            onClick={ () => this.props.fillOutRecipientKeyInput(privateKey) }>
                            {nick}
                        </button>
                    </li>
                )
            })
        } else {
            style.color = "gray";
            listElm.push(<li key="random" style={style}></li>)
        }
        return <ul style={{ 
            position: "absolute", 
            top: "20px", 
            left: "20px", 
            width: "200px", 
            listStyleType: "none", 
            backgroundColor: "#d3e7e8", 
            marginLeft: "auto", 
            marginRight: "auto", 
            textAlign: "center", 
            boxShadow: "1px 2px 10px 2px" }}>
            <p style={{ marginBottom: "5px", fontWeight: "bold" }}>Active Users</p>
            {
                listElm
            }
        </ul>;
    }
}

export default UserList;
