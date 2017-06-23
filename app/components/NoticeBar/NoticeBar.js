import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Snackbar from 'material-ui/Snackbar';

import {notice, requestClose} from '../../redux/modules/noticeBar';

class Notice extends React.Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        message: PropTypes.string.isRequired
    }
    
    constructor(props, context) {
        super(props, context);
    }

    handleRequestClose() {
        this.props.requestClose();
    }

    render() {
        return (
            <div>
                <Snackbar
                    open={this.props.open}
                    message={this.props.message}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                    bodyStyle={{fontFamily: 'Lato', fontSize: '2em', fontWeight:'bold'}}
                />
            </div>
        );
    }
};

function mapStateToProps (state) {
    return { 
        open: state.noticeBar.open,
        message: state.noticeBar.message,
    };
}

export default connect(
    mapStateToProps , 
    {notice, requestClose}
)(Notice)
