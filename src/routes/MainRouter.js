import { createSwitchNavigator } from 'react-navigation';

import { AuthRouter } from './AuthRouter'
import { HomeRouter } from './HomeRouter'
import SplashScreen from '../screens/splash/splash/Splash'

export const MainRouter = createSwitchNavigator(
    {
        SplashScreen: SplashScreen,
        Home: HomeRouter,
        Auth: AuthRouter,
    },
    {
        initialRouteName: 'Auth',
    }
);