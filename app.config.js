// import 'dotenv/config';
// export default{
//   "expo": {
//     "name": "TravelWizard",
//     "slug": "travelwizard",
//     "version": "1.0.0",
//     "orientation": "portrait",
//     "icon": "./assets/images/icon.png",
//      "extra": "BACKEND_URL: process.env.BACKEND_URL",
//     "scheme": "travelwizard",
//     "userInterfaceStyle": "automatic",
//     "newArchEnabled": true,
//     "ios": {
//       "supportsTablet": true
//     },
//     "android": {
//       "adaptiveIcon": {
//         "backgroundColor": "#E6F4FE",
//         "foregroundImage": "./assets/images/android-icon-foreground.png",
//         "backgroundImage": "./assets/images/android-icon-background.png",
//         "monochromeImage": "./assets/images/android-icon-monochrome.png"
//       },
//       "edgeToEdgeEnabled": true,
//       "predictiveBackGestureEnabled": false,
//       "package": "com.anonymous.travelwizard"
//     },
//     "web": {
//       "output": "static",
//       "favicon": "./assets/images/favicon.png"
//     },
//     "plugins": [
//       "expo-router",
//       [
//         "expo-splash-screen",
//         {
//           "image": "./assets/images/splash-icon.png",
//           "imageWidth": 200,
//           "resizeMode": "contain",
//           "backgroundColor": "#ffffff",
//           "dark": {
//             "backgroundColor": "#000000"
//           }
//         }
//       ]
//     ],
//     "experiments": {
//       "typedRoutes": true,
//       "reactCompiler": true
//     },
//   }
// }
import 'dotenv/config';

export default {
  expo: {
    name: "TravelWizard",
    slug: "travelwizard",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "travelwizard",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
        permissions: ["ACCESS_FINE_LOCATION"]
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.travelwizard",
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
