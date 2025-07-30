import React, { useEffect, useRef } from 'react'
import { Tldraw, createTLStore, defaultShapeUtils, getSnapshot, loadSnapshot } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

const Whiteboard = ({ sendData, onSnapshotReceived, username, whiteboardStarter }) => {
    const storeRef = useRef(createTLStore({ shapeUtils: defaultShapeUtils }))
    const editorRef = useRef()

    const onMount = (editor) => {
        editorRef.current = editor
        const initialSnapshot = getSnapshot(editor.store)

        if (username === whiteboardStarter) {
            sendData(initialSnapshot)
        }

        editor.store.listen(() => {
            const snapshot = getSnapshot(editor.store)
            sendData(snapshot)
        })
    }

    useEffect(() => {
        if (!onSnapshotReceived || !storeRef.current) return;

        const cleanup = onSnapshotReceived((snapshot) => {
            if (!snapshot || !editorRef.current) return

            try {
                editorRef.current.store.mergeRemoteChanges(() => {
                    loadSnapshot(editorRef.current.store, snapshot)
                })
            } catch (err) {
                console.error("Failed to apply snapshot", err)
            }
        })

        return cleanup
    }, [onSnapshotReceived])

    return (
        <div className='whiteBoard' style={{ height: '80%', width: '80%' }}>
            <Tldraw autoFocus store={storeRef.current} onMount={onMount} />
        </div>
    )
}


export default Whiteboard
