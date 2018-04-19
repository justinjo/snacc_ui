import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
  TextInput,
  Button,
  Alert,
  RefreshControl
} from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';

var secrets = require('./Secrets.js');

class GroceryList extends Component {
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
      />
      :
      <ListItem
        key={item.id}
        roundAvatar
        title={item.name}
        onPress={() => this.props.nav.navigate('Edit', 
          {
            selected: item,
            refresh: this._onRefresh.bind(this)
          }
        )}
        // hideChevron
      />
    );
  }

  _onRefresh() {
    console.log("Refreshing GroceryList");
    this.setState({refreshing: true});
    if (this.props.refreshData()) {
      this.setState({refreshing: false});
      console.log("Successfully refreshed grocery data");
    } else {
      console.log("Could not refresh grocery data");
    }
  }

  render() {
    return(
        <List containerStyle={{marginTop: 0, flex: 1}}>
          <FlatList
            data={this.props.data}
            keyExtractor={(item, index) => item.id}
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

  _click(newState) {
    this.state = newState;
    console.log(this.state);
  }
}


export class GroceryScreen extends Component {
  constructor(props) {
    super(props);
    console.log('Constructing GroceryScreen');

    this.state = {
      data: [],
    };

    this.params = { TableName: "shoppingList" };
  }

  componentDidMount = function() {
    this.refreshData();
  }

  refreshData = function() {
    ddb.scan(this.params, this.fetchData);
    return true;
  }.bind(this);

  fetchData = function(err, data) {
    console.log('Fetching grocery data...');
    if (err) {
      console.log("Error", err);
    } else {
      console.log('Updated grocery data');
      this.setState({data: this.formatData(data)});
    }
  }.bind(this);

  formatData(data) {
    formattedData = [];
    data.Items.forEach((data) => {
      formattedData.push({
        id: data.listItemID.N,
        name: data.itemName.S
      })
    })
    return formattedData;
  }

  render() {
    return (
      <GroceryList 
        data={this.state.data}
        nav={this.props.navigation}
        refreshData={this.refreshData}
      />
    );
  }
}


export class AddScreen extends Component {
  constructor(props) {
    super(props);
    console.log('Constructing AddScreen');
    console.log(this.props)
    this.state = {
      text: ""
    };
  }

  writeItem() {
    var params = {
      Item: {
        "listItemID": {
          N: (+new Date()).toString()
        },
        "itemName": {
          S: this.state.text
        },
      }, 
      ReturnConsumedCapacity: "TOTAL", 
      TableName: "shoppingList"
    }
    ddb.putItem(params,
    (err, data) => {
      if (err) {
        console.log("Error", err);
      }
    });
  }

  render() {
    return (
      <View style={{marginTop: 0, padding: 10, flex: 1}}>
        <Text>Item Name</Text>
        <TextInput
          style={{height: 40, backgroundColor: 'white', borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => {this.setState({text})}}
          value={this.state.text}
          editable = {true}
          maxLength = {40}
        />
        <Button 
          title="Add item to list"
          onPress={() => {
            console.log('Adding ' + this.state.text + ' to grocery list');
            this.writeItem();
            this.props.navigation.goBack();
            }
          }
          disabled={this.state.text==''}
        />
      </View>
    );
  }
}


export class EditScreen extends Component {
  constructor(props) {
    super(props);
    console.log('Constructing EditScreen');
    console.log(this.props);
    this.state = {
      listItemID: this.props.navigation.state.params.selected.id,
      text: this.props.navigation.state.params.selected.name
    }
  }

  // boughtItem() {
  //   var params = {
  //     Item: {
  //       "itemID": {
  //         N: (+new Date()).toString()
  //       },
  //       "itemType": {
  //         S: this.state.text
  //       },
  //     }, 
  //     ReturnConsumedCapacity: "TOTAL", 
  //     TableName: "fridgeItems"
  //   }
  //   ddb.putItem(params,
  //   (err, data) => {
  //     console.log(err);
  //     console.log(data);
  //   });
  //   this.deleteItem();
  // }

  deleteItem() {
    var params = {
      Key: {
        "listItemID": {
          N: this.state.listItemID
        },
      }, 
      TableName: "shoppingList"
    }
    ddb.deleteItem(params,
    (err, data) => {
      console.log('Probably deleted ' + this.state.text);
    });
  }

  render() {
    return (
      <View style={{marginTop: 0, padding: 10, flex: 1}}>
        <Text>You are removing {this.state.text} from the fridge</Text>
        
        <Button 
          title="Delete item"
          onPress={() => {
            this.deleteItem();
            this.props.navigation.state.params.refresh();
            this.props.navigation.goBack();
            }
          }
          
        />
      </View>
    );
  }
}

// <Button
        //   title="Bought item"
        //   onPress={() => {
        //     console.log('ayy');
        //     Alert.alert(
        //        'You bought some '+this.state.text
        //     );
        //     this.boughtItem();
        //     this.props.navigation.goBack();
        //   }}
        // />

AWS.config = new AWS.Config();
AWS.config.accessKeyId = secrets.getAccessKeyID();
AWS.config.secretAccessKey = secrets.getSecretAccessKey();
AWS.config.region = secrets.getRegion();
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
