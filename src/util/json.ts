export const attemptParseJSON = (str?: string | null) => {
  if (!str) return
  try {
    return JSON.parse(str)
  } catch (e) {}
}
