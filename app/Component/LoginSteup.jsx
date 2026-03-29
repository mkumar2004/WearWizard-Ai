import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'
import Logo from "../../assets/images/Travellogo.svg";
import { Image } from "react-native";

const LoginSetup = () => {
  const { width, height } = useWindowDimensions();
  
  // Responsive sizing constants
  const isSmallScreen = height < 700;
  const logoWidth = Math.min(width * (isSmallScreen ? 0.6 : 0.75), 360);
  const logoHeight = logoWidth * 0.625; // 400:250 ratio
  const iconSize = Math.min(width * 0.18, 80);
  const largeIconSize = Math.min(width * 0.22, 100);

  return ( 
    <View style={[styles.container, { height: isSmallScreen ? 180 : 250 }]}>
      {/* Decorative Parrots (Absolute) */}
      <View style={styles.decorativeLayer}>
        <View style={[styles.TopParrots, { top: isSmallScreen ? 5 : 20 }]}>
          <Image
            source={require('../../assets/Animation/LogoParo.gif')}
            style={{ width: iconSize, height: iconSize }}
          />
          <Image
            source={require('../../assets/Animation/LogoParo.gif')}
            style={{ width: iconSize, height: iconSize, transform: [{ scaleX: -1 }] }}
          />
        </View>

        {!isSmallScreen && (
          <View style={[styles.BottomParrots, { top: height * 0.22 }]}>
            <Image
              source={require('../../assets/Animation/LogoParo.gif')}
              style={{ width: largeIconSize, height: largeIconSize }}
            />
            <Image
              source={require('../../assets/Animation/LogoParo.gif')}
              style={{ width: largeIconSize, height: largeIconSize, transform: [{ scaleX: -1 }] }}
            />
          </View>
        )}
      </View>

      {/* Main Logo Content (In Layout Flow) */}
      <View style={[styles.LogoContent, { width: logoWidth + 25, height: logoHeight + 25, borderRadius: (logoWidth + 25) / 2 }]}>
        <Logo width={logoWidth} height={logoHeight} />
      </View>
    </View>
  )
}

export default LoginSetup

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    zIndex: 1,
    // Fix the vertical space the setup takes
    height: 250, 
    justifyContent: 'center',
  },
  decorativeLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  LogoContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  TopParrots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
  },
  BottomParrots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    paddingHorizontal: 5,
  }
})