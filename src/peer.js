import Peer from 'peerjs';

let peerInstance = null;

export function getPeer() {
  if (!peerInstance) {
    peerInstance = new Peer({
      host: 'peerjs.com',
      secure: true,
      port: 443,
    });
  }
  return peerInstance;
}