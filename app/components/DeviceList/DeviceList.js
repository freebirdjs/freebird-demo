import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

export default class DeviceList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var devs = this.props.devs;
    var listItems = devs.map((function (devInfo) {

        var subnetName = _.split(devInfo.netcore, '-'),
        subnetName = subnetName[subnetName.length - 1];


        return (
          <TableRow key={devInfo.id} selected={false}>
            <TableRowColumn>{devInfo.id}</TableRowColumn>
            <TableRowColumn>{subnetName}</TableRowColumn>
            <TableRowColumn>{devInfo.net.address.permanent}</TableRowColumn>
            <TableRowColumn>{devInfo.net.address.dynamic}</TableRowColumn>
            <TableRowColumn>{devInfo.net.status}</TableRowColumn>
            <TableRowColumn>{new Date(devInfo.net.timestamp)}</TableRowColumn>
            <TableRowColumn>{new Date(devInfo.net.joinTime)}</TableRowColumn>
            <TableRowColumn>{new Date(devInfo.attrs.manufacturer)}</TableRowColumn>
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
            <TableHeaderColumn colSpan="3" tooltip="Devices Managed By Freebird" style={{textAlign: 'center'}}>
              Device List
            </TableHeaderColumn>
          </TableRow>
          <TableRow>
            <TableHeaderColumn>Device Id</TableHeaderColumn>
            <TableHeaderColumn>Subnet</TableHeaderColumn>
            <TableHeaderColumn>Permanent Addr</TableHeaderColumn>
            <TableHeaderColumn>Dynamic Addr</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn>Latest Activity</TableHeaderColumn>
            <TableHeaderColumn>Join Time</TableHeaderColumn>
            <TableHeaderColumn>Manufacturer</TableHeaderColumn>
          </TableRow>
        </TableHeader>

        <TableBody>
          {listItems}
        </TableBody>
      </Table>
    );
  }


