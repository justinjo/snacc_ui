import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';

var secrets = require('./Secrets.js');

class FlatScreen extends Component {
  constructor(props) {
    super(props);
    // this.state.value = 0;
    this.value = 0;
  }



  renderSingle(item) {
    return( this.value ?
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
  

  render() {
    return(
        <List containerStyle={{marginTop: 0, flex: 1}}>
          <FlatList
            data={this.props.data}
            renderItem={({item}) => (this.renderSingle(item))}
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
    console.log('constructing');

    this.state = {
      data: [],
    };


    this.params = { TableName: "fridgeItems" };
  }

  componentDidMount = function() {
    ddb.scan(this.params, this.fetchData);
  };

  fetchData = function(err, data) {
    console.log('test');
    if (err) {
      console.log("Error", err);
    } else {
      // console.log(data);
      // console.log(data.Items);
      // this.setState({data: data.Items});
      this.setState({data: this.formatData(data)});
      // console.log(this.state.data);
    }
  }.bind(this);

  formatData(data) {
    formattedData = [];
    data.Items.forEach((data) => {
      formattedData.push({
        key: data.itemName.S,
        name: data.itemName.S
      })
    })

    return formattedData;
  }

  render() {
    return (
      <FlatScreen data={this.state.data} />
    );
  }
}

AWS.config = new AWS.Config();
AWS.config.accessKeyId = secrets.getAccessKeyID();
AWS.config.secretAccessKey = secrets.getSecretAccessKey();
AWS.config.region = secrets.getRegion();
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});