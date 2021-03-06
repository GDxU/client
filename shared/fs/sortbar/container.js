// @flow
import * as React from 'react'
import {namedConnect} from '../../util/container'
import * as RowTypes from '../row/types'
import SortBar, {height} from './sortbar'
import * as I from 'immutable'
import * as Types from '../../constants/types/fs'
import * as Constants from '../../constants/fs'
import * as FsGen from '../../actions/fs-gen'

type OwnProps = {
  path: Types.Path,
}

const mapStateToProps = (state, {path}: OwnProps) => ({
  _loadingPaths: state.fs.loadingPaths,
  sortSetting: state.fs.pathUserSettings.get(path, Constants.makePathUserSetting()).get('sort'),
})

const mapDispatchToProps = (dispatch, {path}) => ({
  sortSettingToAction: (sortSetting: Types.SortSetting) => () => {
    dispatch(FsGen.createSortSetting({path, sortSetting}))
  },
})

const emptySet = I.Set()

const mergeProps = ({sortSetting, _loadingPaths}, {sortSettingToAction}, {path}: OwnProps) => ({
  folderIsPending: _loadingPaths.get(path, emptySet).size > 0,
  sortSetting,
  sortSettingToAction,
})

const ConnectedSortBar = namedConnect<OwnProps, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  'SortBar'
)(SortBar)

export default ConnectedSortBar

export const asRows = (path: Types.Path): Array<RowTypes.RowItemWithKey> =>
  Types.getPathLevel(path) !== 1
    ? [
        {
          height,
          key: 'sort-bar',
          node: <ConnectedSortBar path={path} />,
          rowType: 'header',
        },
      ]
    : []
