import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import { useDispatch } from 'react-redux'

import { SAView, DivView, BottomView } from '@components/Container'
import { BRounded } from '@components/Button'
import { TILine } from '@components/TextInput'
import OtpScreen from '@screens/Otp'
import * as userActions from '@actions/user'

const PhoneScreen = () => {
    const [phoneNo, setPhoneNo] = useState('')
    const [confirmResult, setConfirmResult] = useState(null)

    const dispatch = useDispatch()

    const generateRandomNumChar = () => {
        return Math.random().toString(36).substr(2, 6)
    }

    const generateRandomNum = () => {
        return Math.floor(100000 + Math.random() * 900000)
    }

    const validatePhoneNumber = () => {
        var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
        return regexp.test(`+60${phoneNo}`)
    }

    const handleResetNumber = () => {
        setConfirmResult(null)
    }

    const handleSendCode = () => {
        if (validatePhoneNumber()) {
            auth()
                .signInWithPhoneNumber(`+60${phoneNo}`)
                .then(confirmResult => {
                    console.log('handleSendCode result', confirmResult)
                    setConfirmResult(confirmResult)
                })
                .catch(error => {
                    console.log('handleSendCode error', error)
                })
        } else {
            alert('Invalid phone number.')
        }
    }

    // const handleSendCode = () => {
    //     if (validatePhoneNumber()) {
    //         auth()
    //             .signInWithPhoneNumber(`+60${phoneNo}`)
    //             .then(confirmResult => {
    //                 // console.log('handleSendCode result', confirmResult)
    //                 confirmResult
    //                     .confirm('123456')
    //                     .then(user => {
    //                         // console.log('handleVerifyCode user', user)
    //                     })
    //                     .catch(error => {
    //                         console.log('handleVerifyCode error', error)
    //                     })
    //             })
    //             .catch(error => {
    //                 console.log('handleSendCode error', error)
    //             })
    //     } else {
    //         alert('Invalid phone number.')
    //     }
    // }

    const handleVerifyCode = (otpText) => {
        if (otpText.length == 6) {
            confirmResult
                .confirm(otpText)
                .then(result => {
                    // console.log('handleVerifyCode result', result)
                })
                .catch(error => {
                    console.log('handleVerifyCode error', error)
                })
        } else {
            alert('Please enter a 6 digit OTP code.')
        }
    }

    const onCreateAccount = (uid) => {
        const ref = database().ref(`/users/${uid}`);
        ref.set({
            phoneNo: `+60${phoneNo}`,
            verCode: generateRandomNumChar(),
            pinCode: generateRandomNum()
        })
            .then(() => {
                console.log('onCreateAccount RESULT')
                dispatch(userActions.loginUser(auth().currentUser))
            })
            .catch(error => {
                console.log('onCreateAccount ERROR', error)
            })
    }

    const onAuthStateChanged = () => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                onCreateAccount(user.uid)
            }
        })
    }

    useEffect(() => {
        const subscriber = onAuthStateChanged()
        return () => {
            subscriber
        }
    }, [phoneNo, onAuthStateChanged])

    if (confirmResult) {
        return (
            <OtpScreen
                onResetNumber={() => handleResetNumber()}
                onSendOtp={(text) => handleVerifyCode(text)}
            />
        )
    }

    return (
        <SAView>
            <DivView>
                <View style={styles.mainContainer}>
                    <ScrollView>
                        <Text style={styles.text1}>Enter your mobile number to be contacted</Text>
                        <View style={{ height: 50 }} />
                        <View style={styles.rowContainer}>
                            <View style={styles.countryNoContainer}>
                                <Text style={styles.text2}>+60</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TILine
                                    onChangeText={text => setPhoneNo(text)}
                                    value={phoneNo}
                                    keyboardType="numeric"
                                    editable
                                />
                            </View>
                        </View>
                        <View style={{ height: 50 }} />
                        <Text style={styles.text2}>We'll text you a One-Time PIN (OTP)</Text>
                        <View style={{ height: 20 }} />
                        <Text style={styles.text3}>Setting up for your family? Use their number instead of yours.</Text>
                    </ScrollView>
                </View>
                <BottomView>
                    <BRounded
                        onPress={handleSendCode}
                        text="Submit"
                    />
                </BottomView>
            </DivView>
        </SAView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 22,
    },
    rowContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    countryNoContainer: {
        width: 50,
    },
    inputContainer: {
        flex: 1,
    },
    text1: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    text2: {
        fontSize: 20,
    },
    text3: {
        fontSize: 14,
    },
})

export default PhoneScreen
