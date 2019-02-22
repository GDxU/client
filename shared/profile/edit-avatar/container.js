// @flow
import EditAvatar from '.'
import * as ProfileGen from '../../actions/profile-gen'
import * as TeamsGen from '../../actions/teams-gen'
import * as WaitingGen from '../../actions/waiting-gen'
import * as RPCTypes from '../../constants/types/rpc-gen'
import * as Constants from '../../constants/profile'
import {connect} from '../../util/container'
import * as RouteTreeGen from '../../actions/route-tree-gen'
import {anyErrors, anyWaiting} from '../../constants/waiting'
import type {RouteProps} from '../../route-tree/render-route'

type OwnProps = RouteProps<
  {
    createdTeam: boolean,
    image: any,
    sendChatNotification: boolean,
    teamname: string,
  },
  {}
>

const mapStateToProps = (state, ownProps) => ({
  createdTeam: ownProps.routeProps.get('createdTeam'),
  error: anyErrors(state, Constants.uploadAvatarWaitingKey),
  image: ownProps.routeProps.get('image'),
  sendChatNotification: ownProps.routeProps.get('sendChatNotification') || false,
  submitting: anyWaiting(state, Constants.uploadAvatarWaitingKey),
  teamname: ownProps.routeProps.get('teamname'),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClose: () => {
    dispatch(WaitingGen.createClearWaiting({key: Constants.uploadAvatarWaitingKey}))
    dispatch(RouteTreeGen.createNavigateUp())
  },
  onSaveTeamAvatar: (
    filename: string,
    teamname: string,
    sendChatNotification,
    crop?: RPCTypes.ImageCropRect
  ) => dispatch(TeamsGen.createUploadTeamAvatar({crop, filename, sendChatNotification, teamname})),
  onSaveUserAvatar: (filename: string, crop?: RPCTypes.ImageCropRect) =>
    dispatch(ProfileGen.createUploadAvatar({crop, filename})),
})

const networkErrorCodes = [
  RPCTypes.constantsStatusCode.scgenericapierror,
  RPCTypes.constantsStatusCode.scapinetworkerror,
  RPCTypes.constantsStatusCode.sctimeout,
]
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  let error = ''
  if (stateProps.error) {
    error = networkErrorCodes.includes(stateProps.error.code)
      ? "We're having trouble connecting to the internet. Check your network and try again."
      : "We don't support this type of image, try a different one."
  }
  return {
    createdTeam: stateProps.createdTeam,
    error,
    image: stateProps.image,
    onClose: dispatchProps.onClose,
    onSave: (filename: string, crop?: RPCTypes.ImageCropRect) =>
      stateProps.teamname
        ? dispatchProps.onSaveTeamAvatar(filename, stateProps.teamname, stateProps.sendChatNotification, crop)
        : dispatchProps.onSaveUserAvatar(filename, crop),
    sendChatNotification: stateProps.sendChatNotification,
    submitting: stateProps.submitting,
    teamname: stateProps.teamname,
    waitingKey: Constants.uploadAvatarWaitingKey,
  }
}

export default connect<OwnProps, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(EditAvatar)
