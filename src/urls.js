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
    GET_EMAIL_LABELS: `get-labels`
}