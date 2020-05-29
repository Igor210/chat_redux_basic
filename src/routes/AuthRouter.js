import { createStackNavigator } from 'react-navigation';

import TotalScreen from '../screens/auth/login/Total'

export const AuthRouter = createStackNavigator(
    { 
        TotalScreen: { screen: TotalScreen , navigationOptions: {header: null,},},
    },
);