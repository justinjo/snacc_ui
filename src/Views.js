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
import { FridgeScreen } from './Contents'
import { GroceryScreen, AddScreen, EditScreen } from './Grocery'

class DrawerIcon extends Component {
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

class AddIcon extends Component {
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

class CancelIcon extends Component {
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

class SubmitIcon extends Component {
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

const FridgeStack = StackNavigator({
  FridgeScreen: {
    screen: FridgeScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Fridge',
      headerLeft: <DrawerIcon nav={navigation} />
    }),
  },
});

const GroceryStack = StackNavigator({
  GroceryScreen: {
    screen: GroceryScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Grocery List',
      headerLeft: <DrawerIcon nav={navigation} />,
      headerRight: <AddIcon nav={navigation} />
    }),
  },
  Add: {
    screen: AddScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Grocery List',
      headerLeft: <CancelIcon nav={navigation} />,
      // headerRight: <SubmitIcon nav={navigation} />
    }),
  },
  Edit: {
    screen: EditScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Edit Item',
      headerLeft: <CancelIcon nav={navigation} />,
      // headerRight: <SubmitIcon nav={navigation} />
    }),

  }
});



export const Root = DrawerNavigator({
  FridgeScreen: {
    screen: FridgeStack,
    navigationOptions: {
      title: 'Fridge Contents',  // Title to appear in status bar
    },
  },
  GroceryScreen: {
    screen: GroceryStack,
    navigationOptions: {
      title: 'Groceries'
    },
  },
}, {
  drawerWidth: 300
});



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