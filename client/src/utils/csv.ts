function escapeCsvValue(value: unknown) {
  if (value === null || value === undefined) {
    return ''
  }

  const text = String(value)

  if (
    text.includes(',') ||
    text.includes('"') ||
    text.includes('\n')
  ) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

export function exportCsv(
  filename: string,
  headers: string[],
  rows: unknown[][]
) {
  const csvRows = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) =>
      row.map(escapeCsvValue).join(',')
    )
  ]

  const csvContent = csvRows.join('\n')

  const blob = new Blob(
    [csvContent],
    {
      type: 'text/csv;charset=utf-8;'
    }
  )

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')

  link.href = url
  link.download = filename

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}