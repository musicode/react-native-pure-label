'use strict'

import React, {
  Component,
} from 'react'

import {
  View,
  Text,
  Platform,
} from 'react-native'

let extraTextStyle = null

if (Platform.OS === 'ios') {
  extraTextStyle = {
    fontFamily: 'PingFangSC-Regular'
  }
}

let linkPattern = /(https?:\/\/[^\s\b]+|([a-z]+\.)?[-\w]+\.(com|cn|org|net|io)[^\s\b]*)/i

function parseLink(str, linkText) {
  let result = []
  let index = 0
  let match
  while (match = linkPattern.exec(str)) {
    result.push({
      text: str.substr(0, match.index)
    })
    result.push({
      link: match[0],
      text: linkText || match[0],
    })
    index = match.index + match[0].length
    str = str.substr(index)
  }
  if (str.length) {
    result.push({
      text: str
    })
  }
  return result
}

export default class Label extends Component {

  static propTypes = {
    ...Text.propTypes,
    textStyle: Text.propTypes.style,
  }

  static defaultProps = {

  }

  static parseLink = parseLink

  render() {

    let {
      children,
      style,
      textStyle,
      linkable,
      linkText,
      linkStyle,
      onLinkPress,
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
        let tokens = parseLink(children, linkText)
        if (tokens.length > 1) {
          children = (
            <Text style={textStyle} {...props}>
              {
                tokens.map((token, index) => {
                  let style, onPress
                  if (token.link) {
                    style = linkStyle
                    if (onLinkPress) {
                      onPress = () => {
                        onLinkPress(token.link)
                      }
                    }
                  }
                  return (
                    <Text key={`${index}-${token.link || token.text}`} style={style} onPress={onPress}>
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
