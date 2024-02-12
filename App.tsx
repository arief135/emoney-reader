import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NfcManager, { NfcTech, nfcManager } from 'react-native-nfc-manager';
import { Buffer } from 'buffer';

export default function App() {
  
}


function App2() {

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
    setStatus('WAITING')
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology([ NfcTech.IsoDep ]);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);

      // read emoney number
      // const raw = await NfcManager.transceive([ 0, -77, 0, 0, 63 ])

      // read saldo emoney: amount, date , time
      // const raw = await NfcManager.transceive([ 0, -75, 0, 0, 10 ])

      // emoney
      // const raw = await NfcManager.transceive([ 0, -78, 0, 0, 40 ])

      // emoney
      const raw = await NfcManager.transceive([ 0, -92, 4, 0, 8, 0, 0, 0, 0, 0, 0, 0, 1 ])

      console.warn(raw.length)
      console.warn(raw)

      for (let i = 0; i < raw.length; i++) {
        const e = raw[i];
        const h = e.toString(16)
        // const h = parseInt(e.toString(16), 16)
        console.warn(h)
      }


      // console.warn(await NfcManager.transceive([ 106,130 ]))

      // console.warn(await NfcManager.ndefHandler)
      // console.warn(await NfcManager.ndefFormatableHandlerAndroid)
      // console.warn(await NfcManager.nfcAHandler)
      // console.warn(await NfcManager.isoDepHandler)
      // console.warn(NfcManager.mifareClassicHandlerAndroid.)
      // console.warn(await NfcManager.mifareClassicGetBlockCountInSector(1))
      // const sectorCount = await NfcManager.mifareClassicHandlerAndroid.mifareClassicGetSectorCount()
      // console.warn('sectorCount ', sectorCount)

      // for (let i = 0; i < sectorCount; i++) {
      //   try {
      //     console.warn('sector ', i)

      //     const block = await NfcManager.mifareClassicHandlerAndroid.mifareClassicSectorToBlock(i)
      //     const data = await NfcManager.mifareClassicHandlerAndroid.mifareClassicReadBlock(block)

      //     console.warn('block ', block)
      //     console.warn('data ', data)

      //     console.warn(Buffer.from(data).toString())
      //   } catch (ex) {
      //     console.warn('Oops!', ex);
      //   }
      // }

    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
      setStatus('IDLE')
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
