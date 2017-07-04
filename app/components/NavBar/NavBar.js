import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import SivannIcon from '../../static/sivann_logo.png';
import {permitJoin, permitJoining} from '../../redux/modules/navBar';
import _ from 'busyman';

class NavBar extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    onClickCallback() {
        var self = this;

        return function () {
            self.props.permitJoin(60);
        };
    }

    render() {
        let permitTimeLeft = this.props.timeLeft;
        let iconLeft = <img src={SivannIcon} style={{position: "absolute", top: "40%", bottom: "0", left: "10%", right: "0", height: "25%", margin: "0"}} />;
        let iconRight = (permitTimeLeft !== 0) ?
                    <LinearProgress style={{position: "absolute", top: "50%", bottom: "0", left: "85%", right: "0", margin: "0", width: '120px'}} color='#F2784B' mode="determinate" max={60} value={permitTimeLeft}/> : 
                    <FlatButton style={{position: "absolute", top: "10%", bottom: "0", left: "85%", right: "0", margin: "0", fontFamily: 'Lato'}} label="Permit join" onClick={this.onClickCallback()}/>;

        return (
            <AppBar
                title={this.props.title}
                titleStyle={{fontFamily: 'Lato', fontWeight:'bold', textAlign: 'center'}}
                iconElementLeft={iconLeft}
                iconElementRight = {iconRight}
                style={{backgroundColor: '#2C3E50'}}
            />
        );
    }
};

function mapStateToProps (state) {
    return { 
        timeLeft: state.navBar.timeLeft 
    };
}

export default connect(
    mapStateToProps,
    {permitJoin}
)(NavBar)
