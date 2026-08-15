const history = {
  title: 'History',
  subtitle: 'Closed and expired permits · read-only archive',
  exportCsv: 'Export CSV',
  type: {
    all: 'All types',
    hot: 'Hot Work',
    confined: 'Confined Space',
    heights: 'Heights'
  },
  status: {
    all: 'All statuses',
    CLOSED: 'Closed',
    EXPIRED: 'Expired'
  },
  toolbar: {
    searchPlaceholder: 'Search ID, title, location',
    dateFrom: 'From date',
    dateTo: 'To date',
    clear: 'Clear'
  },
  table: {
    columns: {
      id: 'PERMIT ID',
      type: 'TYPE',
      titleLocation: 'TITLE · LOCATION',
      closed: 'CLOSED/EXPIRED',
      duration: 'DURATION',
      status: 'STATUS'
    }
  },
  // Design (SmartWorkPermit-v3.dc.html) binds `histResultCount` without a static
  // copy string for it — this phrasing is ours, not transcribed from the design.
  resultCount: '{count} permits found',
  empty: {
    title: 'No permits match your filters',
    description: 'Try clearing the search or adjusting the type / status filters.',
    clearFilters: 'Clear filters'
  },
  error: {
    loadFailed: 'Could not load history. Please try again.',
    detailFailed: 'Could not load permit detail. Please try again.',
    exportFailed: 'Could not export CSV. Please try again.'
  },
  drawer: {
    close: 'Close',
    viewOnly: 'View Only · {status} — this record is archived and cannot be edited.',
    sectionDetails: 'PERMIT DETAILS',
    location: 'Location',
    foreman: 'Foreman',
    workDate: 'Work date',
    duration: 'Duration',
    closedDate: 'Closed date',
    closedBy: 'Closed by',
    sectionWorkDescription: 'WORK DESCRIPTION',
    downloadPdf: 'Download Permit PDF',
    placeholderChip: 'placeholder'
  }
}

export default history
