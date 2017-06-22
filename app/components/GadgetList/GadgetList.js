import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

export default class GadgetList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var gads = this.props.gads;
    var listItems = gads.map((function (gadInfo) {

        var subnetName = _.split(gadInfo.netcore, '-'),
        subnetName = subnetName[subnetName.length - 1];


        return (
          <TableRow key={gadInfo.id} selected={false}>
            <TableRowColumn>{gadInfo.id}</TableRowColumn>
            <TableRowColumn>{subnetName}</TableRowColumn>
            <TableRowColumn>{gadInfo.dev.permAddr}</TableRowColumn>
            <TableRowColumn>{gadInfo.panel.classId}</TableRowColumn>
            <TableRowColumn>{gadInfo.auxId}</TableRowColumn>
            <TableRowColumn>{gadInfo.attrs.sensorValue || gadInfo.attrs.onOff || ''}</TableRowColumn>
          </TableRow>
        );
    });

    return (
      <Table
        onRowSelection={this.handleRowSelection}
        height={this.props.height}
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
            <TableHeaderColumn colSpan="3" tooltip="Gadgets Managed By Freebird" style={{textAlign: 'center'}}>
              Gadget List
            </TableHeaderColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn>Gadget Id</TableHeaderColumn>
            <TableHeaderColumn>Subnet</TableHeaderColumn>
            <TableHeaderColumn>Permanent Addr</TableHeaderColumn>
            <TableHeaderColumn>Gadget Type</TableHeaderColumn>
            <TableHeaderColumn>Auxiliary Id</TableHeaderColumn>
            <TableHeaderColumn>Value</TableHeaderColumn>
          </TableRow>
        </TableHeader>

        <TableBody>
          {listItems}
        </TableBody>
      </Table>
    );
  }


