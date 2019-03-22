'use strict'

import React, {
  PureComponent,
} from 'react'

import {
  View,
  Text,
  Platform,
} from 'react-native'

import * as patternParser from '@musicode/pattern-parser'

let extraTextStyle = null

if (Platform.OS === 'ios') {
  extraTextStyle = {
    fontFamily: 'PingFangSC-Regular'
  }
}

export default class Label extends PureComponent {

  static propTypes = {
    ...Text.propTypes,
    textStyle: Text.propTypes.style,
  }

  static defaultProps = {

  }

  render() {

    let {
      children,
      style,
      textStyle,
      linkable,

      telText,
      telStyle,
      onTelPress,

      urlText,
      urlStyle,
      onUrlPress,

      emailText,
      emailStyle,
      onEmailPress,

      ...props
    } = this.props

    if (extraTextStyle) {
      if (textStyle) {
        textStyle = [
          extraTextStyle,
          textStyle
        ]
      }
      else {
        textStyle = extraTextStyle
      }
    }

    if (typeof children === 'string') {
      // nothing to do
    }
    else if (typeof children === 'number') {
      children = '' + children
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
        children = children.join('')
      }
      else {
        children = (
          <View style={{flex: 1}}>
            {children}
          </View>
        )
      }
    }

    if (typeof children === 'string') {
      if (linkable) {
        let tokens = patternParser.parseAll(children)
        if (tokens.length > 1) {
          children = (
            <Text style={textStyle} {...props}>
              {
                tokens.map((token, index) => {
                  let style, onPress
                  if (token.link) {

                    if (token.type === 'tel') {
                      style = telStyle
                      if (telText) {
                        token.text = telText
                      }
                      if (onTelPress) {
                        onPress = () => {
                          onTelPress(token.link)
                        }
                      }
                    }
                    else if (token.type === 'url') {
                      style = urlStyle
                      if (urlText) {
                        token.text = urlText
                      }
                      if (onUrlPress) {
                        onPress = () => {
                          onUrlPress(token.link)
                        }
                      }
                    }
                    else if (token.type === 'email') {
                      style = emailStyle
                      if (emailText) {
                        token.text = emailText
                      }
                      if (onEmailPress) {
                        onPress = () => {
                          onEmailPress(token.link)
                        }
                      }
                    }

                  }
                  return (
                    <Text
                      key={`${index}-${token.link || token.text}`}
                      style={style}
                      onPress={onPress}
                    >
                      {token.text}
                    </Text>
                  )
                })
              }
            </Text>
          )
        }
      }
      if (typeof children === 'string') {
        children = (
          <Text style={textStyle} {...props}>
            {children}
          </Text>
        )
      }
    }

    if (!children) {
      return null
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
