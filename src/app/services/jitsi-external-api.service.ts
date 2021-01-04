import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class JitsiExternalApiService {
  private Jitsi: any = null;
  private jitsiConfigObject = {
    fileRecordingsEnabled: true,
    dropbox: {
      appKey: null, // Specify your app key here.
      redirectURI: 'https://jitsi-meet.example.com/subfolder/static/oauth.html'  // A URL to redirect the user to, after authenticating
    },
    startAudioOnly: false, // Start the conference in audio only mode (no video is being received nor sent)
    startWithAudioMuted: true, // Start with muted audio only for current user
    resolution: 720, // Sets the preferred resolution (height) for local video. Defaults to 720.
    enableNoAudioDetection: true, // Enabling this will run the lib-jitsi-meet no audio detection module which will notify the user if the current selected microphone has no audio input and will suggest another valid device if one is present.
    // hosts: {
    //   // XMPP domain.
    //   domain: 'jitsi-meet.example.com',
    //
    //   // When using authentication, domain for guest users.
    //   // anonymousdomain: 'guest.example.com',
    //
    //   // Domain for authenticated users. Defaults to <domain>.
    //   // authdomain: 'jitsi-meet.example.com',
    //
    //   // Focus component domain. Defaults to focus.<domain>.
    //   // focus: 'focus.jitsi-meet.example.com',
    //
    //   // XMPP MUC domain. FIXME: use XEP-0030 to discover it.
    //   muc: 'conference.jitsi-meet.example.com'
    // },
    // // BOSH URL. FIXME: use XEP-0156 to discover it.
    // bosh: '//jitsi-meet.example.com/http-bind',
    //
    // // Websocket URL
    // // websocket: 'wss://jitsi-meet.example.com/xmpp-websocket',
    //
    // // The name of client node advertised in XEP-0115 'c' stanza
    // clientNode: 'http://jitsi.org/jitsimeet',
    enableWelcomePage: false, // Whether to use a welcome page or not. In case it's false a random room will be joined when no room is specified.
    prejoinPageEnabled: true, // When 'true', it shows an intermediate page before joining, where the user can configure their devices.
  };

  private interfaceConfig = {
    APP_NAME: 'Jitsi External Api Sandbox',
    AUDIO_LEVEL_PRIMARY_COLOR: 'rgba(255,255,255,0.4)',
    AUDIO_LEVEL_SECONDARY_COLOR: 'rgba(255,255,255,0.2)',
    TOOLBAR_BUTTONS: [
      'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
      'fodeviceselection', 'hangup', 'profile', 'recording',
      'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
      'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
      'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
    ]
  };

  private jitsiConnectionConfig = {
    host: 'localhost:8443',
    roomName: null,
    parentNode: null,
    configOverwrite: this.jitsiConfigObject,
    interfaceConfigOverwrite: this.interfaceConfig,
    userInfo: { // Current user info
      email: '',
      displayName: ''
    }
  };

  private hasConnection$ = new BehaviorSubject(false);

  /**
   * Create new jitsi connection
   * @param roomName
   * @param container
   */
  createConnection(roomName: string, container: Element): void {
    this.jitsiConnectionConfig.roomName = roomName;
    this.jitsiConnectionConfig.parentNode = container;
    this.Jitsi = new (window as any).JitsiMeetExternalAPI(this.jitsiConnectionConfig.host, this.jitsiConnectionConfig);

    if (this.Jitsi) {
      this.hasConnection$.next(true);
    } else {
      this.hasConnection$.next(false);
    }
  }

  /**
   * Close jitsi connection
   * It's a good practice to remove the conference before the page is unloaded.
   */
  closeConnection() {
    if (this.Jitsi) {
      this.Jitsi.dispose();
    }

    this.hasConnection$.next(false);
  }

  // Setters
  // Run these before creating connection

  setUserInfo(name: string, email: string): void {
    this.jitsiConnectionConfig.userInfo.displayName = name;
    this.jitsiConnectionConfig.userInfo.email = email;
  }

  setStartConferenceWithAudioOnly(state = false) {
    this.jitsiConfigObject.startWithAudioMuted = state;
  }

  setStartAudioOnly(state = false) {
    this.jitsiConfigObject.startAudioOnly = state;
  }

  setDropboxCredentials(appKey: string, redirectURI: string) {
    this.jitsiConfigObject.dropbox.appKey = appKey;
    this.jitsiConfigObject.dropbox.redirectURI = redirectURI;
  }

  setFileRecordingsEnabled(state = true) {
    this.jitsiConfigObject.fileRecordingsEnabled = state;
  }

  setPrejoinPageEnabled(state = true) {
    this.jitsiConfigObject.prejoinPageEnabled = state;
  }

  setAppName(name = '') {
    this.interfaceConfig.APP_NAME = name;
  }

  setHost(host = 'localhost:8443') {
    this.jitsiConnectionConfig.host = host;
  }

  //Execute commands
  //Run these when conenction has been estabilished


  // Event listeners

  // Jitsi getters

  /**
   * Retrieve a list of available devices.
   * @return Observable
   */
  getAvailableDevices(): Observable<any> {
    return fromPromise(this.Jitsi.getAvailableDevices());
  }

  /**
   * Retrieve a list with the devices that are currently selected.
   * @return Observable
   */
  getCurrentDevices(): Observable<any> {
    return fromPromise(this.Jitsi.getCurrentDevices());
  }

  /**
   * Returns an array containing participants information like participant id, display name, avatar URL and email.
   * @return Observable
   */
  getParticipantsInfo(): Observable<any> {
    return fromPromise(this.Jitsi.getParticipantsInfo());
  }

  /**
   * Returns the current video quality setting.
   * @return Observable
   */
  getVideoQuality(): Observable<any> {
    return fromPromise(this.Jitsi.getVideoQuality());
  }


  //Jitsi execute commands

  /**
   * Captures the screenshot of the large video.
   * @return Observable
   */
  captureLargeVideoScreenshot(): Observable<string> {
    return fromPromise(this.Jitsi.captureLargeVideoScreenshot());
  }

  /**
   * Elects the participant with the given id to be the pinned participant in order to always receive video for this participant (even when last n is enabled).
   */
  pinParticipant(participantId: any) {
    this.Jitsi.pinParticipant(participantId);
  }

  /**
   * Sets the audio input device to the one with the label or id that is passed.
   */
  setAudioInputDevice(deviceLabel: string, deviceId: any) {
    this.Jitsi.setAudioInputDevice(deviceLabel, deviceId);
  }

  /**
   * Sets the audio output device to the one with the label or id that is passed.
   */
  setAudioOutputDevice(deviceLabel: string, deviceId: any) {
    this.Jitsi.setAudioOutputDevice(deviceLabel, deviceId);
  }

  /**
   * Sets the video input device to the one with the label or id that is passed.
   */
  setVideoInputDevice(deviceLabel: string, deviceId: any) {
    this.Jitsi.setVideoInputDevice(deviceLabel, deviceId);
  }

  /**
   * Starts a file recording or streaming session.
   *  @param options:
   *   mode: string //recording mode, either `file` or `stream`.
   *   dropboxToken: string, //dropbox oauth2 token.
   *   shouldShare: boolean, //whether the recording should be shared with the participants or not. Only applies to certain jitsi meet deploys.
   *   rtmpStreamKey: string, //the RTMP stream key.
   *   rtmpBroadcastID: string, //the RTMP broadcast ID.
   *   youtubeStreamKey: string, //the youtube stream key.
   *   youtubeBroadcastID: string //the youtube broacast ID.
   */
  startRecording(options: any = {}) {
    //     mode: string //recording mode, either `file` or `stream`.
    //     dropboxToken: string, //dropbox oauth2 token.
    //     shouldShare: boolean, //whether the recording should be shared with the participants or not. Only applies to certain jitsi meet deploys.
    //     rtmpStreamKey: string, //the RTMP stream key.
    //     rtmpBroadcastID: string, //the RTMP broadcast ID.
    //     youtubeStreamKey: string, //the youtube stream key.
    //     youtubeBroadcastID: string //the youtube broacast ID.
    this.Jitsi.startRecording(options);
  }

  /**
   * Starts a file recording or streaming session.
   */
  stopRecording(mode: 'stream' | 'file') {
    this.Jitsi.stopRecording(mode);
  }

  /**
   * Mutes / unmutes the audio for the local participant. No arguments are required.
   */
  toogleCurrentAudio() {
    this.Jitsi.executeCommand('toggleAudio');
  }

  /**
   * Trigger the video for the local participant. No arguments are required.
   */
  toggleCurrentVideo() {
    this.Jitsi.executeCommand('toggleVideo');
  }


  /**
   * Hides / shows the chat. No arguments are required.
   */
  toggleChat() {
    this.Jitsi.executeCommand('toggleChat');
  }

  /**
   * Starts / stops screen sharing. No arguments are required.
   */
  toggleShareScreen() {
    this.Jitsi.executeCommand('toggleShareScreen');
  }

  /**
   * Hangups the call. No arguments are required.
   */
  closeCall() {
    this.Jitsi.executeCommand('hangup');
  }

  /**
   * Sends a text message to another participant through the datachannels.
   */
  sendPrivateTextMessage(participantId: any, message: string) {
    this.Jitsi.executeCommand('sendEndpointTextMessage', participantId, message);
  }

  /**
   * Sends a text message to another participant through the datachannels.
   */
  setVideoQuality(quality: number = 720) {
    this.Jitsi.executeCommand('setVideoQuality', quality);
  }

  /**
   * Mute all the other participants. It can only be executed by a moderator. No arguments are required.
   */
  muteEveryone() {
    this.Jitsi.executeCommand('muteEveryone');
  }

}
