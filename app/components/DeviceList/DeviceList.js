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

const DeviceList = ({ devs, height }) => {
    let listItems = Object.keys(devs).map(function (id) {
        let devInfo = devs[id],
            subnetName = _.split(devInfo.netcore, '-');

        subnetName = subnetName[subnetName.length - 1];
        
        return (
          <TableRow key={devInfo.id} selected={false}>
            <TableRowColumn>{devInfo.id}</TableRowColumn>
            <TableRowColumn>{subnetName}</TableRowColumn>
            <TableRowColumn>{devInfo.net.address.permanent}</TableRowColumn>
            <TableRowColumn>{devInfo.net.address.dynamic}</TableRowColumn>
            <TableRowColumn>{devInfo.net.status}</TableRowColumn>
            <TableRowColumn>{new Date(devInfo.net.timestamp).toString()}</TableRowColumn>
            <TableRowColumn>{new Date(devInfo.net.joinTime).toString()}</TableRowColumn>
            <TableRowColumn>{devInfo.attrs.manufacturer}</TableRowColumn>
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
            <TableHeaderColumn colSpan="8" tooltip="Devices Managed By Freebird" style={{textAlign: 'center'}}>
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

        <TableBody displayRowCheckbox={false}>
          {listItems}
        </TableBody>
      </Table>
    );
}

DeviceList.propTypes = {
    devs: PropTypes.object.isRequired,
    height: PropTypes.number,
};

export default DeviceList
