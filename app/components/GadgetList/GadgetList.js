import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import _ from 'busyman';

const GadgetList = ({ gads, height }) => {
    let listItems = Object.keys(gads).map(function (id) {
        let gadInfo = gads[id],
            subnetName = _.split(gadInfo.netcore, '-'),
            gadValue;

        if (!_.isNil(gadInfo.attrs.sensorValue))
          gadValue = gadInfo.attrs.sensorValue;
        else if (!_.isNil(gadInfo.attrs.dInState))
          gadValue = gadInfo.attrs.dInState.toString();
        else if (!_.isNil(gadInfo.attrs.onOff))
          gadValue = gadInfo.attrs.onOff.toString();
        else 
          gadValue = '';

        subnetName = subnetName[subnetName.length - 1];
        return (
          <TableRow key={gadInfo.id} selected={false}>
            <TableRowColumn>{gadInfo.id}</TableRowColumn>
            <TableRowColumn>{subnetName}</TableRowColumn>
            <TableRowColumn>{gadInfo.dev.permAddr}</TableRowColumn>
            <TableRowColumn>{gadInfo.panel.classId}</TableRowColumn>
            <TableRowColumn>{gadValue}</TableRowColumn>
          </TableRow>
        );
    });

    return (
      <Table
        height={height}
        fixedHeader={true}
        fixedFooter={false}
        selectable={false}
        multiSelectable={false}
      >

        <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
        >
          <TableRow>
            <TableHeaderColumn colSpan="5" tooltip="Gadgets Managed By Freebird" style={{textAlign: 'center'}}>
              Gadget List
            </TableHeaderColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn>Gadget Id</TableHeaderColumn>
            <TableHeaderColumn>Subnet</TableHeaderColumn>
            <TableHeaderColumn>Permanent Addr</TableHeaderColumn>
            <TableHeaderColumn>Gadget Type</TableHeaderColumn>
            <TableHeaderColumn>Value</TableHeaderColumn>
          </TableRow>
        </TableHeader>

        <TableBody displayRowCheckbox={false}>
          {listItems}
        </TableBody>
      </Table>
    );
}

GadgetList.propTypes = {
    gads: PropTypes.object.isRequired,
    height: PropTypes.number,
};

export default GadgetList
