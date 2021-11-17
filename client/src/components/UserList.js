import React from 'react';

import 'babel-polyfill';

class UserList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeUsers: props.activeUsers,
        };
    }

    render() {
        return (
            <div style={{ position: absolute, left: 0 }}>
                <ul id="users">
                    {this.state.activeUsers.map(user => {
                        return (
                            <li>{ user.nickname }</li>
                        )
                    })}
                </ul>
            </div>
        );
    }
}

export default UserList;