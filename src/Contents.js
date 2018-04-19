import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
  RefreshControl
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import Amplify from 'aws-amplify';

var secrets = require('./Secrets.js');

class FlatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      pressed: false,
    };
  }

  renderSingle(item) {
    return( this.state.pressed ?
      <ListItem
        roundAvatar
        title="pressed"
        onPress = {() => {this._click(0)}}
      />
      :
      <ListItem
        roundAvatar
        title={item.name}
        onPress = {() => {this._click(1)}}
      />
    );
  }
  
  
  _onRefresh() {
    console.log("Refreshing FridgeList");
    this.setState({refreshing: true});
    if (this.props.refreshData()) {
      console.log("Successfully refreshed fridge data");
      this.setState({refreshing: false});
    } else {
      console.log("Could not refresh fridge data");
    }
  }

  render() {
    return(
        <List containerStyle={{marginTop: 0, flex: 1}}>
          <FlatList
            data={this.props.data}
            keyExtractor={(item, index) => item.key}
            renderItem={({item}) => (this.renderSingle(item))}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />
        </List>
    );
  }

  _click(value){
    this.value = value;
   // this.setState({value: value});
  }

}



export class FridgeScreen extends Component {
  constructor(props) {
    super(props);
    console.log('Constructing FridgeScreen');

    this.state = {
      data: [],
    };

    this.params = { TableName: "fridgeItems" };
  }

  componentDidMount = function() {
    this.refreshData();
  };

  refreshData = function() {
    ddb.scan(this.params, this.fetchData);
    return true;
  }.bind(this);

  fetchData = function(err, data) {
    console.log('Fetching fridge data...');
    if (err) {
      console.log("Error", err);
    } else {
      console.log('Updated fridge data');
      this.setState({data: this.formatData(data)});
    }
  }.bind(this);

  formatData(data) {
    formattedData = [];
    data.Items.forEach((data) => {
      formattedData.push({
        key: data.itemID.N,
        name: data.itemType.S
      })
    })
    return formattedData;
  }

  render() {
    return (
      <FlatScreen data={this.state.data} refreshData={this.refreshData} />
    );
  }
}

AWS.config = new AWS.Config();
AWS.config.accessKeyId = secrets.getAccessKeyID();
AWS.config.secretAccessKey = secrets.getSecretAccessKey();
AWS.config.region = secrets.getRegion();
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});