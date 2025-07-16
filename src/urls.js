const search_param = (num, item, value) => {
    return `page=${num}&row_per_page=${item}&search=${value}`
}
export const api_url = {
    all_social_platform: "social-platforms/all",
    fcampaign_cdr_report: `fcampaign/cdr-report`,
    FPORTAL_ALL_CDR: (num, item, val) => `fportalcdr/all?${search_param(num, item, val)}`,
    FCAMPAIGN_DID_LISTING: (num, item, val) => `fcampaign/did/listings?${search_param(num, item, val)}`,
    FCAMPAIGN_CDR_GRAPH_REPORT: (hours, start_date, end_date) => `fcampaign/cdr-report?hours=${hours}&start_date=${start_date}&end_date=${end_date}`,
    MOVE_TO_TRASH: `/move-to-trash`,
    EMAIL_STATUS: `email-status`,
    GET_EMAIL_LABELS: (id) => `get-labels?id=${id}`,
    GET_EMAIL_BY_UID: (payload) => `get-emails-by-uid?type=${payload?.type}&uid=${payload?.uid}&id=${payload?.id}`,
    DOWNLOAD_MAIL_ATACHMENT: (payload) => `download-attachment?type=${payload?.type}&uid=${payload?.uid}`,
    ALL_MAIL_SETTINGS: `mail-setting/all`,
    
    // report -> click to call api's list start here
    CLICK_TO_CALL_REPORT_URL: `click-to-call-report`,

    // aws related api's
    AI_SEARCH: `/dev2/ai-search`,
    CHAT_BOT: `/dev2/chat_bot`,
    AI_REPLY: `/dev2/ai-reply`,
    AI_DASHBOARD: `/dev2/ai-dashboard`,

    // meet related api's
    MEET_STOP_RECORDING: (name) => `/stop-recording?roomName=${name}`,
    MEET_START_RECORDING: (name) =>  `/start-recording?roomName=${name}`,
    MEET_RECORDING: (id) => `/recordings?roomName=${id}`,

    // webrtc-> message module api's
    PIN_MESSAGE: (message_id, isPin) => `/message/${message_id}/${isPin}`
}