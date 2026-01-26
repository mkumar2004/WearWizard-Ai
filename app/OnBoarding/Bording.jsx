import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useRef } from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import LogoCast from '../CompondData/LogoCast';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux'

const Bording = () => {
  const {user, loading } = useSelector((state) => state.auth);
  const onboardingRef = useRef(null);
  const currentIndex = useRef(0);
  const route = useRouter();


  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex.current < LogoCast.length - 1) {
        currentIndex.current += 1;
        onboardingRef.current?.goToPage(currentIndex.current, true);
      } else {
        clearInterval(interval);
        route.push('auth/Login');
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.Container}>
      {LogoCast.length > 0 && (
        <Onboarding
          ref={onboardingRef}
          showSkip={false}
          showNext={false}
          showDone={false}
          bottomBarHighlight={false}
          titleStyles={styles.title}
          subTitleStyles={styles.subTitle}
          DotComponent={({ selected }) => (
            <View
              style={{
                width: selected ? 22 : 8,
                height: selected ? 22 : 8,
                borderRadius: selected ? 11 : 4,
                marginHorizontal: 8,
                alignItems: 'center',
                justifyContent: 'center',

                backgroundColor: selected ? 'rgba(70, 80, 255, 0.25)' : '#FF3B3B',

                shadowColor: '#4650FF',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: selected ? 0.9 : 0,
                shadowRadius: selected ? 12 : 0,


                elevation: selected ? 12 : 0,
              }}
            >
              {/* Inner solid dot */}
              {selected && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#4650FF',
                  }}
                />
              )}
            </View>
          )}

          pages={LogoCast.map((item, index) => ({
            backgroundColor: '#fff',
            image: (
              <View style={{ alignItems: 'center' }}>
                <Image source={item.Logo} style={styles.logo} />
                <Image source={item.pic} style={styles.pic} />
                <Image source={item.BottomLog} style={styles.bottompic} />
              </View>
            ),
            title: item.title,
            subtitle: item.subTitle,
          }))}

        />
      )}
    </View>
  )
};

export default Bording

const styles = StyleSheet.create({
  Container: {
    flex: 1,

  },
  logo: {
    width: 150,
    height: 100,

  },
  pic: {
    width: 340,
    height: 320
  },
  bottompic: {
    width: 120,
    height: 120,
    marginTop: 20
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    bottom: 40
  },

  subTitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
    bottom: 40
  },
})