export const getDatesTrip = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate)
    const end = new Date(endDate)

    const diffTime = end - start
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    return Math.floor(diffDays) + 1
}