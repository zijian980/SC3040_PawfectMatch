export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  if (isNaN(date.getTime())) return "Invalid Date"

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }

  return new Intl.DateTimeFormat("en-US", options).format(date)
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)

  if (isNaN(date.getTime())) return "Invalid Date"

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }

  return new Intl.DateTimeFormat("en-US", options).format(date)
}

export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString)

  if (isNaN(date.getTime())) return "Invalid date"

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }

  return new Intl.DateTimeFormat("en-CA", options).format(date)
}
