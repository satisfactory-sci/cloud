import React from 'react';

class CommentView extends React.Component {

    render() {

        var itemStyle = {
            width: '100%',
            height: '125px',
            borderBottom: '1px solid lightgrey',
        }
        var textContainerStyle = {
            fontSize: '1.1em',
            padding: '10px',
            margin: 0
        }
        var imgStyle = {
            float: 'right',
            width: '125px',
            height: '125px',
        }
        return (
            <div style={itemStyle}>
                <img style={imgStyle} src={this.props.data.img} />
                <p style={textContainerStyle}>
                    <small>{this.props.data.user} - {this.props.data.time}:</small><br/>
                    {this.props.data.text}
                </p>
            </div>
        );
    }
}

export default CommentView;