import React from 'react';

class ChatInput extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.onClick} className="inputbox">
                <input
                    id={this.props.inputIdValue}
                    autoComplete="off"
                    onChange={this.props.onChange}
                    value={this.props.value}
                    disabled={true}
                    placeholder={this.props.placeholder}
                    disabled={this.props.inputDisabled}/>
                <button 
                    type="submit"
                    id={this.props.buttonIdValue}
                    style={{
                        display: !this.props.buttonDisabled ? "none" : "",
                        cursor: "pointer",
                    }}>
                    {this.props.children}
                </button>
            </form>
        )
    }
}

export default ChatInput;
