import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import {permitJoin, permitJoining} from '../../redux/modules/navBar';
import _ from 'busyman';

var NavBar = React.createClass({
    onClickCallback: function () {
        var self = this;

        return function () {
            self.props.permitJoin(60);
        };
    },

    render: function () {
        let permitTimeLeft = this.props.timeLeft;
        let iconRight = (permitTimeLeft !== 0 && !_.isObject(permitTimeLeft)) ?
                    <LinearProgress style={{position: "absolute", top: "50%", bottom: "0", left: "85%", right: "0", margin: "0", width: '120px'}} color='#F2784B' mode="determinate" max={60} value={permitTimeLeft}/> : 
                    <FlatButton style={{position: "absolute", top: "10%", bottom: "0", left: "85%", right: "0", margin: "0", fontFamily: 'Lato'}} label="Permit join" onClick={this.onClickCallback()}/>;

        return (
            <AppBar
                title={this.props.title}
                titleStyle={{fontFamily: 'Lato', fontWeight:'bold', textAlign: 'center'}}
                iconElementLeft={<div/>}
                iconElementRight = {iconRight}
                style={{backgroundColor: '#2C3E50'}}
            />
        );
    }
});

function mapStateToProps (state) {
    return { 
        timeLeft: state.navBar.timeLeft 
    };
}

export default connect(
    mapStateToProps,
    {permitJoin}
)(NavBar)
