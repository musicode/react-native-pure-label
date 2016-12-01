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
    ...Text.propTypes,
    textStyle: Text.propTypes.style,
  }

  render() {

    let {
      children,
      style,
      textStyle,
      ...props,
    } = this.props

    if (typeof children === 'string' || typeof children === 'number') {
      children = (
        <Text style={textStyle} {...props}>
          {children}
        </Text>
      )
    }
    else if (children && children.length > 1) {
      let isString = true
      for (let i = 0, len = children.length; i < len; i++) {
        if (typeof children[i] !== 'string') {
          isString = false
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

    return (
      <View style={style}>
        {children}
      </View>
    )
  }
}
