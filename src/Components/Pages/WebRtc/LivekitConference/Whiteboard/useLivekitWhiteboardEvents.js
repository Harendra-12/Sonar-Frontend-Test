import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'

export const useLiveKitWhiteboardEvents = ({
    room,
    roomName,
    onRemoteOpen = (bool) => { },
    onSnapshotReceived = () => { },
    onStarterId = (id) => { },
}) => {
    const hasOpenedWhiteboard = useRef(false);

    useEffect(() => {
        if (!room) return

        const handleData = (payload) => {
            let whiteboardStarterId = null;
            try {
                const text = new TextDecoder().decode(payload)
                const data = JSON.parse(text)

                if (!data?.type || data?.roomId !== roomName) return

                if (data.type === 'whiteboard-toggle') {
                    if (data.status) {
                        onRemoteOpen(true);
                        whiteboardStarterId = data.userId;
                        onStarterId(whiteboardStarterId)
                        toast.success("Whiteboard is opened by " + data.userId.split("-")[0]);
                    } else {
                        onRemoteOpen(false);
                        toast.success("Whiteboard is closed by " + data.userId.split("-")[0]);
                        whiteboardStarterId = null;
                        onStarterId(null)
                    }
                }

                if (data.type === 'whiteboard') {
                    onSnapshotReceived(data.snapshot);
                    onStarterId(data.whiteboardStarter)

                    if (!hasOpenedWhiteboard.current) {
                        onRemoteOpen(true);
                        hasOpenedWhiteboard.current = true;
                    }
                }

            } catch (e) {
                console.error('LiveKit whiteboard event parse error', e)
            }
        }

        room.on('dataReceived', handleData)
        return () => room.off('dataReceived', handleData)
    }, [room, roomName, onRemoteOpen, onSnapshotReceived])
}
