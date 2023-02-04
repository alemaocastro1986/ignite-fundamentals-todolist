export async function json(request, response) {
  const buffers = [];
  for await (const chunk of request) {
    buffers.push(chunk);
  }
  try {
    request.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch (err) {
    request.body = null;
  }
  response.setHeader("Content-type", "application/json");
  response.json = (data) => {
    return response.end(JSON.stringify(data));
  };
}
