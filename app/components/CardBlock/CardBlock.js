import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GridLayout from 'react-grid-layout';
import { WidthProvider } from 'react-grid-layout';

import { getDevs, getGads, write } from '../../redux/modules/cardBlock';

import { Light, Buzzer, Flame, Pir, Switch, Temperature, 
        Humidity, Illuminance, Pressure, Weather } from '../Card/Card';

import DeviceList from '../DeviceList/DeviceList';
import GadgetList from '../GadgetList/GadgetList';


var ReactGridLayout = WidthProvider(GridLayout);

var keyCounter,
    layoutDataGrids;

class CardBlock extends React.Component {
    static propTypes = {
        getDevs: PropTypes.func.isRequired,
        getGads: PropTypes.func.isRequired
    }

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.props.getDevs();
        this.props.getGads();
    }

    getKeyAndDataGrid(type) {
        var cardProps = {
            key: null,
            dataGrid: null
        };

        switch (type) {
            case 'lightCtrl':
            case 'buzzer':
            case 'flame':
            case 'presence':
            case 'pwrCtrl':
                cardProps.key = 'smallCard' + keyCounter.small;
                keyCounter.small += 1;

                if (layoutDataGrids.smallCard.length > 0) 
                    cardProps.dataGrid = layoutDataGrids.smallCard.splice(-(layoutDataGrids.smallCard.length), 1)[0];
                else 
                    cardProps.dataGrid = {x: Math.floor(Math.random() * 5) + 3, y: 4, w: 1, h: 2};
                break;

            case 'temperature':
            case 'humidity':
            case 'illuminance':
                cardProps.key = 'bigCard' + keyCounter.big;
                keyCounter.big += 1;

                if (layoutDataGrids.bigCard.length > 0) 
                    cardProps.dataGrid = layoutDataGrids.bigCard.splice(-(layoutDataGrids.bigCard.length), 1)[0];
                else 
                    cardProps.dataGrid = {x: Math.floor(Math.random() * 5) + 3, y: 4, w: 2, h: 2};
                break;

            default:
                break;
        }

        return cardProps;
    }

    onClickCallback(id, attrName, value) {
        var self = this;

        return function () {
            self.props.write(id, attrName, !value);
        };
    }

    getCard(type, status, id, attrs) {
        var card,
            value,
            attrName,
            enable = false,
            cardProps = this.getKeyAndDataGrid(type);

        if (status === 'online') {
            enable = true;
        }

        switch (type) {
            case 'lightCtrl':
                value = attrs.onOff;
                attrName = 'onOff';
                card = (<Light enable={enable} onOff={value} onClick={this.onClickCallback(id, attrName, value)} />);
                break;
            case 'buzzer':
                value = attrs.onOff;
                attrName = 'onOff';
                card = (<Buzzer enable={enable} onOff={value} onClick={this.onClickCallback(id, attrName, value)} />);
                break;
            case 'flame':
                value = attrs.dInState;
                card = (<Flame enable={enable} triggered={value} />);
                break;
            case 'presence':
                value = attrs.dInState;
                card = (<Pir enable={enable} triggered={value} />);
                break;
            case 'pwrCtrl':
                value = attrs.onOff;
                card = (<Switch enable={enable} onOff={value} />);
                break;
            case 'temperature':
                value = attrs.sensorValue.toFixed(1);
                card = (<Temperature enable={enable} temp={value} />);
                break;
            case 'humidity':
                value = attrs.sensorValue.toFixed(1);
                card = (<Humidity enable={enable} humid={value} />);
                break;
            case 'illuminance':
                value = attrs.sensorValue;
                card = (<Illuminance enable={enable} lux={value} />);
                break;
            case 'pressure':
                value = attrs.sensorValue;
                card = (<Pressure enable={enable} pValue={value} />);
                break;
            default:
                break;
        }

        if (!card) return;

        return (
            <div key={cardProps.key} data-grid={cardProps.dataGrid}>
                {card}
            </div>
        );
    }

    getRowHeight() {
        var rowHeight;

        if (window.matchMedia("(min-width: 1800px)").matches) {
            rowHeight = 70;
        } else if (window.matchMedia("(min-width: 1400px)").matches) {
            rowHeight = 60;
        } else if (window.matchMedia("(min-width: 1000px)").matches) {
            rowHeight = 45;
        } else if (window.matchMedia("(min-width: 600px)").matches) {
            rowHeight = 35;
        } else {
            rowHeight = 20;
        }

        return rowHeight;
    }

    render() {
        var allGadRender = [],
            rowHeight = this.getRowHeight(),
            filteredGads = gadsFilter(this.props.gads);

        keyCounter = {
            small: 0,
            big: 0
        };

        layoutDataGrids = {
            smallCard: [
                {x: 4, y: 0, w: 1, h: 2},
                {x: 4, y: 1, w: 1, h: 2},
                {x: 4, y: 2, w: 1, h: 2},
                {x: 5, y: 2, w: 1, h: 2},
                {x: 6, y: 2, w: 1, h: 2}
            ],
            bigCard: [
                {x: 2, y: 0, w: 2, h: 2},
                {x: 2, y: 1, w: 2, h: 2},
                {x: 2, y: 2, w: 2, h: 2}
            ]
        };

        for (var id in filteredGads) {
            var devId = filteredGads[id].dev.id,
                type = filteredGads[id].panel.classId,
                status = this.props.devs[devId].net.status,
                attrs = filteredGads[id].attrs,
                card = this.getCard(type, status, id, attrs);

            if (card)
                allGadRender.push(card);
        }

        allGadRender.push(
            <div key='Weather' data-grid={{x: 5, y: 0, w: 2, h: 4}}>
                <Weather />
            </div>
        );
        
        return (
            <div>
                <div style={{margin:'1% 0%'}}>
                    <ReactGridLayout cols={9} rowHeight={rowHeight} isDraggable={false}>
                        {allGadRender}
                    </ReactGridLayout>
                </div>
                <br />
                <div>
                    <DeviceList devs={this.props.devs}/> 
                </div>
                <br />
                <div>
                    <GadgetList gads={filteredGads}/> 
                </div>
            </div>
        );
    }
};

function gadsFilter(gads) {
    var gadNames = ['lightCtrl', 'buzzer', 'flame', 'presence', 'pwrCtrl', 'temperature', 'humidity', 'illuminance', 'pressure'],
        filteredGads = {},
        classId;

    for (var id in gads) {
        console.log(gads[id]);
        classId = gads[id].panel.classId;
        if (gadNames.indexOf(classId) !== -1) {
            if (classId !== 'illuminance') {
                filteredGads[id] = gads[id];
            } else if (classId === 'illuminance' && gads[id].attrs.id === 0) {
                filteredGads[id] = gads[id];
            }
        }
    }

    return filteredGads;
}
                    
function mapStateToProps (state) {
    return { 
        devs: state.cardBlock.devs,
        gads: state.cardBlock.gads 
    };
}

export default connect(
    mapStateToProps, 
    {getDevs, getGads, write}
)(CardBlock)

