export const httpResponse = <T = any>(body: T, code: number = 200) => {
  const response = {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body, null, 2)
  }

  if (response.statusCode === 200 || response.statusCode === 201) {
    console.info(response)
  } else {
    console.error(response)
  }

  return response
}
