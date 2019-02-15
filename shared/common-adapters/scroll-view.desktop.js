// @flow
import * as React from 'react'
import * as Styles from '../styles'
import type {Props} from './scroll-view'

const ScrollView = (props: Props) => {
  const {contentContainerStyle, style, className, ref, hideVerticalScroll, ...rest} = props
  const className = Styles.classNames(
    {'hide-scrollbar': hideVerticalScroll},
    {'scroll-container': hideVerticalScroll}
  )
  const overflowStyle = hideVerticalScroll ? styles.overflowHidden : styles.overflowAuto
  return (
    <div className={className} style={collapseStyles([styles.overflowAuto, style])} onScroll={props.onScroll}>
      <div style={contentContainerStyle} {...rest} />
    </div>
  )
}

const styles = Styles.styleSheetCreate({
  overflowAuto: {
    overflow: 'auto',
  },
  overflowHidden: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
})

export default ScrollView
