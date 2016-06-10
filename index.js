'use strict'

import React, {
  Component,
  PropTypes,
} from 'react'

import {
  View,
  Text,
} from 'react-native'

export default class Label extends Component {

  static propTypes = {
    ...View.propTypes,
    textStyle: Text.propTypes.style,
  }

  render() {

    let {
      children,
      style,
      textStyle,
    } = this.props

    if (typeof children === 'string') {
      children = (
        <Text style={textStyle}>
          {children}
        </Text>
      )
    }
    else if (children && children.length > 1) {
      children = (
        <View style={{flex: 1}}>
          {children}
        </View>
      )
    }

    return (
      <View
        {...this.props}
        style={style}
      >
        {children}
      </View>
    )
  }
}
