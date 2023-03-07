exports.handler = async (event, context, callback) => {
  try {
    const body = JSON.parse(event.body);
  }
  catch (e) {
    console.log(event)
    callback(
      e.message,
      {
        statusCode: 400,
        body: `[ERROR] Invalid JSON - ${e.message}`
      }
    )
    return
  }
  if ( !body.data.email || !body.data.pin ) {
    const errorMessage = '[SPAM DETECTED] Required fields not defined.'
    console.log(errorMessage)
    callback(
      null,
      {
        statusCode: 200,
        body: errorMessage
      }
    )
    return
  }
  const email = body.data.email;
  const pin = body.data.email;
  const URL = `https://script.google.com/macros/s/${process.env.verify_pin_key}/exec?email=${email}&pin=${pin}`;
  return fetch(URL, {
    redirect: "follow",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    }
  });
}
