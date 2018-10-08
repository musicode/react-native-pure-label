'use strict'

import React, {
  Component,
} from 'react'

import {
  View,
  Text,
  Platform,
} from 'react-native'

let extraStyle = null

if (Platform.OS === 'ios') {
  extraStyle = {
    fontFamily: 'PingFangSC-Regular'
  }
}

export default class Label extends Component {

  static propTypes = {
    ...Text.propTypes,
    textStyle: Text.propTypes.style,
  }

  render() {

    let {
      children,
      style,
      textStyle,
      ...props
    } = this.props

    if (extraStyle) {
      if (textStyle) {
        textStyle = [
          extraStyle,
          textStyle
        ]
      }
      else {
        textStyle = extraStyle
      }
    }

    if (typeof children === 'string' || typeof children === 'number') {
      children = (
        <Text style={textStyle} {...props}>
          {children}
        </Text>
      )
    }
    else if (children && children.length > 1) {
      let isString = false
      for (let i = 0, len = children.length; i < len; i++) {
        if (typeof children[i] === 'string') {
          isString = true
          break
        }
      }
      if (isString) {
        children = (
          <Text style={textStyle} {...props}>
            {children.join('')}
          </Text>
        )
      }
      else {
        children = (
          <View style={{flex: 1}}>
            {children}
          </View>
        )
      }
    }

    if (style) {
      return (
        <View style={style}>
          {children}
        </View>
      )
    }

    return children

  }
}
