const search_param = (num, item, value) => {
    return `page=${num}&row_per_page=${item}&search=${value}`
}
export const api_url = {
    all_social_platform: `social-platforms/all`,
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
    MEET_START_RECORDING: (name) => `/start-recording?roomName=${name}`,
    MEET_RECORDING: (id) => `/recordings?roomName=${id}`,

    // webrtc-> message module api's
    PIN_MESSAGE: (message_id, isPin) => `/message/${message_id}/${isPin}`,
    PIN_GROUP_MESSAGE: (message_id, isPin) => `/group-message/${message_id}/${isPin}`,
    ALL_GROUP_CHAT_URL: `/chatgroups/all`,
    MESSAGE_CONTACT_LIST_URL: `/message/contacts`,
    ALL_TAG_URL: `/tags/all`,
    ALL_USER_URL: `/user-all`,
    RECEIVE_ALL_MESSAGE_URL: (id, page_num) => `/message/all?receiver_id=${id}&page=${page_num}`,
    RECEIVE_ALL_GROUP_MESSAGE_URL: (id, page_num) => `/group-message/all?group_id=${id}&page=${page_num}`,
    CHAT_CALLS_URL: (page_num) => `/chatcall/calls?page=${page_num}`,
    SET_ADMIN_URL: (id) => `/chatgroups/admin/${id}`,
    STORE_TAG_URL: `/tags/store`,
    UPDATE_TAG_URL: (selectedTag) => `/tags/update/${selectedTag}`,
    ASSIGN_TAGS_TO_USER_URL: `/tag-users/store`,
    REMOVE_TAGS_FROM_USER_URL: (id) => `/tag-users/destroy/${id}`,
    DELETE_TAG_URL: (id) => `/tags/destroy/${id}`,
    CREATE_GROUP_URL: "/chatgroups/store",
    UPDATE_GROUP_URL: (id) => `/chatgroups/update/${id}`,
    ADD_NEW_MEMBER_TO_GROUP_URL: `/chat-group-users/store`,
    REMOVE_USER_FROM_GROUP_URL: (group_id, id) => `chatgroups/leave/${group_id}?user_id=${id}`,
    DELETE_GROUP_URL: (id) => `/chatgroups/destroy/${id}`,
    CHAT_CALLS_HISTORY_WITH_GROUP_AND_SINGLE_URL: (page_num) => `/groupcall/call-history?page=${page_num}`,
}