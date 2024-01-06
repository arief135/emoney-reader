import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NfcManager, { Ndef, NfcEvents, NfcTech } from 'react-native-nfc-manager';




export default function App() {

  const [ hasNfc, setHasNFC ] = useState(false);
  const [ status, setStatus ] = useState('IDLE');

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported()

      setHasNFC(deviceIsSupported)
      if (deviceIsSupported) {
        await NfcManager.start()
      }
    }

    checkIsSupported()
  }, [])


  // useEffect(() => {
  //   NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
  //     console.log(tag)
  //     console.log(typeof (tag))
  //     console.log('tag found')
  //   })

  //   return () => {
  //     NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
  //   }
  // }, [])


  const readTag = async () => {
    // await NfcManager.registerTagEvent();
    // setStatus('WAITING')
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.NfcA);
      // the resolved tag object will contain `ndefMessage` property
      // const tag = await NfcManager.getTag();
      // console.warn('Tag found', tag);
      // const block = [10]
      // const msg = await NfcManager.nfcAHandler.transceive(block)
      // console.log(msg)
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }

  }

  const cancelReadTag = async () => {
    await NfcManager.unregisterTagEvent()
    setStatus('IDLE')
  }

  if (hasNfc === null) return null;

  if (!hasNfc) {
    return (
      <View style={styles.sectionContainer}><Text>NFC not supported</Text></View>
    )
  }

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <Text>Hello world</Text>
      <TouchableOpacity style={[ styles.btn, styles.btnScan ]} onPress={readTag}>
        <Text style={{ color: "black" }}>ScanTag</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[ styles.btn, styles.btnCancel ]} onPress={cancelReadTag}>
        <Text style={{ color: "white" }}>CancelScan</Text>
      </TouchableOpacity>

      <Text>Status: {status}</Text>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {

  },
  btn: {
    backgroundColor: 'grey',
    marginBottom: 10,
    height: 30
  },
  btnScan: {},
  btnCancel: {},
});
