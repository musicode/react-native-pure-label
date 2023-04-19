'use strict'

import React, {
  createRef,
  PureComponent,
} from 'react'

import {
  View,
  Platform,
} from 'react-native'

import PropTypes from 'prop-types'

import {
  StyledText,
} from '@react-native-hero/styled-text'

let extraTextStyle = null

if (Platform.OS === 'ios') {
  extraTextStyle = {
    fontFamily: 'PingFangSC-Regular'
  }
}

export default class Label extends PureComponent {

  state = {
    measured: false,
    showAllText: false,
    shouldShowReadMore: false,
  }

  static propTypes = {
    foldable: PropTypes.bool,
    textStyle: PropTypes.any,
    renderMoreButton: PropTypes.func,
    renderLessButton: PropTypes.func,
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.textRef = createRef()
  }

  componentWillUnmount() {
    this.hasLayouted = false
  }

  refreshTextLayout = () => {

    this.hasLayouted = true

    let fullHeight = this.textLayout.height

    this.setState(
      {
        measured: true,
      },
      () => {
        requestAnimationFrame(() => {

          if (!this.hasLayouted) {
            return
          }

          this.textRef.current.measure((x, y, w, h) => {

            if (!this.hasLayouted) {
              return
            }

            let limitedHeight = h

            // 怕有小范围数值的偏差
            if (fullHeight - limitedHeight > 5) {
              this.setState({
                shouldShowReadMore: true
              })
            }
            else {
              this.setState({
                showAllText: true,
              })
            }

          })

        })
      }
    )

  }

  handleTextLayout = event => {

    let { foldable } = this.props
    if (!foldable) {
      return
    }

    // 已经刷新过布局了
    if (this.hasLayouted) {
      return
    }

    // 有时候（特别是文本很长时）会连续触发 onLayout
    // 这里只取最后一次触发的数据
    let { layout } = event.nativeEvent
    this.textLayout = layout

    // 过滤
    if (this.layoutTimer) {
      clearTimeout(this.layoutTimer)
    }

    this.layoutTimer = setTimeout(
      this.refreshTextLayout,
      100
    )

  }

  handleTogglePress = () => {
    this.setState({
      showAllText: !this.state.showAllText
    })
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

      imageText,
      imageStyle,
      onImagePress,

      highlightStyle,

      foldable,
      renderMoreButton,
      renderLessButton,
      numberOfLines,
      ...props
    } = this.props

    let {
      measured,
      showAllText,
      shouldShowReadMore,
    } = this.state

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

    let textRootProps = {
      ...props,
      style: textStyle,
      ref: this.textRef,
      onLayout: this.handleTextLayout
    }

    let toggleButton

    if (foldable) {
      if (!numberOfLines) {
        throw new Error("Label's numberOfLines prop is required.")
      }
      if (measured && !showAllText) {
        textRootProps.numberOfLines = numberOfLines
      }
      if (shouldShowReadMore) {
        toggleButton = showAllText
          ? renderLessButton(this.handleTogglePress)
          : renderMoreButton(this.handleTogglePress)
      }
    }
    else if (numberOfLines) {
      textRootProps.numberOfLines = numberOfLines
    }

    children = (
      <StyledText
        {...textRootProps}

        patterns={linkable ? undefined : []}
        telText={telText}
        telStyle={telStyle}
        onTelPress={onTelPress}

        urlText={urlText}
        urlStyle={urlStyle}
        onUrlPress={onUrlPress}

        emailText={emailText}
        emailStyle={emailStyle}
        onEmailPress={onEmailPress}

        imageText={imageText}
        imageStyle={imageStyle}
        onImagePress={onImagePress}

        highlightStyle={highlightStyle}
      >
        {children}
      </StyledText>
    )

    if (style || toggleButton) {
      return (
        <View style={style}>
          {children}
          {toggleButton}
        </View>
      )
    }

    return children

  }
}
