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
  Alert
} from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';

var secrets = require('./Secrets.js');

class GroceryList extends Component {
  constructor(props) {
    super(props);
    this.state = 0;
  }

  renderSingle(item) {
    return( this.state ?
      <ListItem
        roundAvatar
        title="pressed"
      />
      :
      <ListItem
        key={item.id}
        roundAvatar
        title={item.name}
        onPress={() => this.props.nav.navigate('Edit', {selected: item})}
        // hideChevron
      />
    );
  }
  

  render() {
    return(
        <List containerStyle={{marginTop: 0, flex: 1}}>
          <FlatList
            data={this.props.data}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) => (this.renderSingle(item))}
          />
        </List>
    );
  }

  _click(newState) {
    this.state = newState;
    console.log(this.state);
  }
}



class DeleteIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.leftIcon}>
        <Icon
          name="menu"
          size={35}
          onPress={ () => this.props.nav.navigate('DrawerOpen') }
        />
      </View>
    );
  }
}

export class GroceryScreen extends Component {
  constructor(props) {
    super(props);
    console.log('constructing');

    this.state = {
      data: [],
    };


    this.params = { TableName: "shoppingList" };

  }

  componentDidMount = function() {
    this.updateState();
  }

  updateState = function() {
    ddb.scan(this.params, this.fetchData);
  }

  fetchData = function(err, data) {
    console.log('test');
    if (err) {
      console.log("Error", err);
    } else {
      // console.log(data);
      // console.log(data.Items);
      // this.setState({data: data.Items});
      this.setState({data: this.formatData(data)});
      console.log(this.state.data);
    }
  }.bind(this);

  formatData(data) {
    formattedData = [];
    data.Items.forEach((data) => {
      formattedData.push({
        id: data.itemID.N,
        name: data.itemName.S
      })
    })

    return formattedData;
  }
  render() {
    return (
      <GroceryList data={this.state.data} nav={this.props.navigation} />
    );
  }
}




export class AddScreen extends Component {
  constructor(props) {
    super(props);
    console.log('constructing');

    this.state = {
      text: ""
    };
    console.log(this.state.itemID);


  }

  writeItem() {
    var params = {
      Item: {
        "itemID": {
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
      console.log(err);
      console.log(data);
    });
  }

  render() {
    console.log("RENDERING");
    return (
      <View style={{marginTop: 0, padding: 10, flex: 1}}>
        <Text>Item Name</Text>
        <TextInput
          style={{height: 40, backgroundColor: 'white', borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => {this.setState({text}); console.log(text)}}
          value={this.state.text}
          editable = {true}
          maxLength = {40}
        />
        <Button 
          title="Add item to list"
          onPress={() => {
            console.log(this.state.text);
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
    console.log('constructing');
    console.log(this.props);
    this.state = {
      itemID: this.props.navigation.state.params.selected.id,
      text: this.props.navigation.state.params.selected.name
    }

  }

  // boughtItem() {
  //   var params = {
  //     Item: {
  //       "itemID": {
  //         N: (+new Date()).toString()
  //       },
  //       "itemName": {
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
    console.log(this.state.itemID)
    console.log(this.state.text)
    var params = {
      Key: {
        "itemID": {
          N: this.state.itemID
        },
      }, 
      TableName: "shoppingList"
    }
    ddb.deleteItem(params,
    (err, data) => {
      console.log(err);
      console.log(data);
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
