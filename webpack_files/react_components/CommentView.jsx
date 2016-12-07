import React from 'react';

require("../stylesheets/CommentView.scss");

class CommentView extends React.Component {

    render() {
      let s = {
        fontSize: '1.1em',
        padding: '10px',
        margin: '0px',
      }
        return (
            <div className="comment-container">
                <img className="comment-img" src={this.props.data.img} />
                <p style={s}>
                    <small>{this.props.data.user} - {this.props.data.time}:</small><br/>
                    {this.props.data.text}
                </p>
            </div>
        );
    }
}

export default CommentView;
