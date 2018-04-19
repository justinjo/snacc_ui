import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList
} from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { FridgeScreen } from './Contents';
import { GroceryScreen, AddScreen, EditScreen } from './Grocery';


export class DrawerIcon extends Component {
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


export class AddIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.rightIcon}>
        <Icon
          name="add"
          size={35}
          onPress={ () => this.props.nav.navigate('Add') }
        />
      </View>
    );
  }
}


export class CancelIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.leftIcon}>
        <Icon
          name="keyboard-arrow-left"
          size={35}
          onPress={ 
            () => {
              this.props.nav.goBack(); 
            }
          }
        />
      </View>
    );
  }
}


export class SubmitIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.rightIcon}>
        <Icon
          name="create"
          size={35}
          onPress={ 
            () => {
              this.props.nav.goBack(); 
            }
          }
        />
      </View>
    );
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


const styles = StyleSheet.create({
  listItem: {
    fontSize: 100,
  },

  leftIcon: {
    paddingLeft: 10,
  },

  rightIcon: {
    paddingRight: 10,
  },

});